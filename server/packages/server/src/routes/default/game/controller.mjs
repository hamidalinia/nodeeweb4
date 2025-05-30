let self = ({
    getRoundDetails: async (req, res) => {

        let Question = req.mongoose.model('Question');
        let GameRound = req.mongoose.model('GameRound');
        let Game = req.mongoose.model('Game');
        let Customer = req.mongoose.model('Customer'); // Assuming you have a Customer model

        const {roundId} = req.params; // Include customerId as part of the request parameters
        const {_id: customerId} = req.headers;
        let shouldWeSearch = false
        try {
            // Fetch the round from the database
            console.log("roundId", roundId, customerId)
            const round = await GameRound.findById(roundId)
                .populate({
                    path: 'questions.questions.question', // Populate the referenced 'question' field in each question set
                    select: 'title options' // Select the necessary fields from the Question model
                })
                .populate("participants.customer", "firstName lastName photos _id") // Populate participants' customer details
                .lean()
                .exec();

            if (!round) {
                return res.status(404).json({success: false, message: "Round not found."});
            }
            // console.log("round",round);
            // return

            // Fetch the associated game using the round's gameRounds field
            const game = await Game.findOne({
                gameRounds: round._id // Check if this round is part of any game
            })
                .populate("gameRounds", "startTime endTime status") // Populate round details in game
                .populate("questionCategory", "name") // If needed, populate categories
                .exec();

            if (!game) {
                return res.status(404).json({success: false, message: "Game not found."});
            }
            console.log("game", round?.startTime, game?.limitTime)
            console.log("game", game?.maxParticipants, game?.minParticipants, round?.participants?.length)
            console.log(round?.participants)
            if (round?.participants) {
                let isRoundComplete = true;
                round?.participants.forEach((par, index) => {
                    let pl = round?.participants[index]?.customer?.photos?.length
                    round.participants[index].customer.photos = round?.participants[index]?.customer?.photos[pl - 1]


                    let levels = par?.levels;
                    if (levels) {
                        levels.forEach((level) => {
                            // Check if all answers are provided for this level
                            if (level?.answers && level.answers.length > 0) {
                                let unansweredQuestions = level.answers.filter(answer => !answer.isCorrect && !answer.answer);
                                if (unansweredQuestions.length > 0) {
                                    isRoundComplete = false; // Mark round as incomplete
                                }
                            } else {
                                isRoundComplete = false; // If no answers for the level, round is incomplete
                            }
                        });
                    } else {
                        isRoundComplete = false; // If no levels exist, round is incomplete
                    }
                })

                // If all participants have answered all questions
                if (isRoundComplete) {
                    // Update the round status to "completed"
                    await GameRound.findOneAndUpdate(
                        { _id: round._id }, // Find the round by its ID
                        { $set: { status: "completed" } }, // Update the round status to 'completed'
                        { new: true } // Return the updated document
                    );
                    return res.status(200).json({success: false, message: "Game round is completed!"}); // Correct the status code and response message

                }
            }
            if (game?.maxParticipants === game?.minParticipants && game?.minParticipants > 0) {
                if (round?.participants?.length !== game?.minParticipants) {
                    return res.status(200).json({
                        success: false,
                        message: "Participants length is low.",
                        shouldWeSearch: true
                    });
                }
            }
            if (round?.startTime && game?.limitTime) {
                const startDate = new Date(round.startTime);
                const now = new Date();
                const timeDifferenceMs = now - startDate;
                const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);

                console.log(timeDifferenceSeconds);

                // If time difference exceeds the limitTime, update the round status to 'completed'
                if (parseInt(game?.limitTime) < timeDifferenceSeconds) {
                    await GameRound.findOneAndUpdate(
                        {_id: round._id}, // Find the round by its ID
                        {$set: {status: "completed"}}, // Update the round status to 'completed'
                        {new: true} // Return the updated document
                    );

                    return res.status(200).json({success: false, message: "Game round is completed!"}); // Correct the status code and response message
                }
            }

            // Ensure questions are populated correctly
            if (!round.questions || round.questions.length === 0) {
                return res.status(404).json({success: false, message: "No questions for this round."});
            }

            // Filter the participant based on customerId
            const participant = round.participants.find(p => p.customer._id.toString() === customerId.toString());

            if (!participant) {
                return res.status(404).json({success: false, message: "Participant not found.", round});
            }

            // If round is found, send round, game, and participant data as a response
            res.json({
                success: true,
                shouldWeSearch: shouldWeSearch,
                game: {
                    gameId: game._id,
                    title: game.title,
                    minParticipants: game.minParticipants,
                    maxParticipants: game.maxParticipants,
                    description: game.description,
                    status: game.status,
                    startTime: game.startTime,
                    endTime: game.endTime,
                    levels: game.levels,
                    limitTime: game.limitTime,

                    questionCategory: game.questionCategory,
                },
                round: {
                    roundId: round._id,
                    roundNumber: round.roundNumber, // Assuming this is a field in your model
                    startTime: round.startTime,
                    endTime: round.endTime,
                    duration: round.endTime ? (round.endTime - round.startTime) / 1000 : 0, // Calculate round duration in seconds
                    status: round.status,
                    questions: round.questions.map((q) => ({
                        levelNumber: q.levelNumber,
                        questions: q.questions.map((question) => ({
                            _id: question._id,
                            question: question.question ? question.question.title : '', // Access the populated question title
                            options: question.question?.options ? question.question.options.map((option) => ({
                                _id: option._id,
                                answer: option.answer,
                            })) : [],
                            level: question.level,
                        })),
                    })),
                    // participants: round.participants.map((p) => ({
                    //     customer: p.customer,
                    //     score: p.score,
                    //     accuracy: p.accuracy,
                    //     levels: p.levels.map((level) => ({
                    //         levelNumber: level.levelNumber,
                    //         answers: level.answers.map((ans) => ({
                    //             question: ans.question,
                    //             answer: ans.answer,
                    //             isCorrect: ans.isCorrect,
                    //             timeTaken: ans.timeTaken,
                    //         })),
                    //     })),
                    // })),
                    winner: round.winner,
                },
                participant: {
                    customer: participant.customer,
                    score: participant.score,
                    accuracy: participant.accuracy,
                    levels: participant.levels,
                },
                participants: round?.participants
            });
        } catch (error) {
            console.error("Error fetching round details:", error);
            res.status(500).json({success: false, message: "Internal server error"});
        }
    },
    rounds: async (req, res) => {
        let QuestionCategory = req.mongoose.model('QuestionCategory');
        let Question = req.mongoose.model('Question');
        let Game = req.mongoose.model('Game');
        const {gameId} = req.params;

        try {
            const game = await Game.findById(gameId).populate('gameRounds');
            if (!game) {
                return res.status(404).json({success: false, message: 'Game not found.'});
            }

            res.status(200).json({
                success: true,
                gameRounds: game.gameRounds,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: 'Failed to fetch game rounds.', error: error.message});
        }
    },
    details: async (req, res) => {
        let QuestionCategory = req.mongoose.model('QuestionCategory');
        let Question = req.mongoose.model('Question');
        let Game = req.mongoose.model('Game');
        const {gameId} = req.params;

        try {
            const game = await Game.findById(gameId).populate('levels questionCategory');
            if (!game) {
                return res.status(404).json({success: false, message: 'Game not found.'});
            }

            const categories = await QuestionCategory.find({_id: {$in: game.questionCategory}});

            res.status(200).json({
                success: true,
                game,
                categories
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: 'Failed to fetch game details', error: error.message});
        }
    },
    create: async function (req, res, next) {
        console.log("create game...")
        let Game = req.mongoose.model('Game');
        let QuestionCategory = req.mongoose.model('QuestionCategory');

        try {
            const {
                title,
                description,
                startTime,
                endTime,
                limitTime,
                status = "pending",
                minParticipants,
                maxParticipants,
                randomQuestions = false,
                levels = [],
                questionCategory = null // Optional field
            } = req.body;

            // Validate the question category if provided
            if (questionCategory) {
                const category = await QuestionCategory.findById(questionCategory);
                if (!category) {
                    return res.status(400).json({success: false, message: "Invalid question category."});
                }
            }

            // Create the game
            const game = new Game({
                title,
                description,
                startTime,
                endTime,
                limitTime,
                status,
                minParticipants,
                maxParticipants,
                randomQuestions,
                levels,
                questionCategory
            });

            await game.save();

            res.status(201).json({success: true, message: "Game created successfully", data: game});
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: "Failed to create game", error: error.message});
        }
    },
    // join: async function (req, res, next) {
    //     console.log("join game")
    //     let QuestionCategory = req.mongoose.model('QuestionCategory');
    //     let Game = req.mongoose.model('Game');
    //     let Question = req.mongoose.model('Question');
    //     let GameRound = req.mongoose.model('GameRound'); // Assuming you have a GameRound model
    //     try {
    //         const { gameId } = req.params;
    //         const { selectedCategory, selectedLevel } = req.body;
    //         const { _id: userId } = req.headers;
    //
    //         const game = await Game.findById(gameId).populate('levels questionCategory');
    //         if (!game) {
    //             return res.status(404).json({ success: false, message: "Game not found." });
    //         }
    //
    //         const categories = await QuestionCategory.find({ _id: { $in: game.questionCategory } });
    //         if (!selectedCategory) {
    //             return res.status(200).json({
    //                 success: true,
    //                 message: "Joined game successfully. Select a category to start.",
    //                 categories,
    //             });
    //         }
    //
    //         const isValidCategory = categories.some(cat => cat._id.toString() === selectedCategory);
    //         if (!isValidCategory) {
    //             return res.status(400).json({ success: false, message: "Invalid question category selected." });
    //         }
    //
    //         const level = game.levels.find(lvl => lvl.levelNumber === selectedLevel);
    //         if (!level) {
    //             return res.status(400).json({ success: false, message: "Invalid level selected." });
    //         }
    //
    //         const questions = await Question.find({ questionCategory: selectedCategory })
    //             .limit(level.numberOfQuestions)
    //             .lean();
    //
    //         if (questions.length < level.numberOfQuestions) {
    //             return res.status(400).json({ success: false, message: "Not enough questions for this level." });
    //         }
    //
    //         const round = {
    //             roundNumber: level.levelNumber,
    //             level: level.levelNumber,
    //             status: "pending",
    //             questions: questions.map(q => q._id),
    //             participants: [
    //                 {
    //                     customer: userId,
    //                     score: 0,
    //                     accuracy: 0,
    //                     answers: [],
    //                 },
    //             ],
    //         };
    //
    //         const savedRound = await GameRound.create(round);
    //         game.gameRounds.push(savedRound._id);
    //         await game.save();
    //
    //         return res.status(200).json({
    //             success: true,
    //             message: "Game round created successfully.",
    //             round: savedRound,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ success: false, message: "Failed to join or start game", error: error.message });
    //     }
    // },
    start: async function (req, res, next) {
        const GameRound = req.mongoose.model("GameRound");
        const Game = req.mongoose.model("Game");
        const Question = req.mongoose.model("Question");
        const {gameId} = req.params;
        const {selectedCategory} = req.body;
        const {_id: userId} = req.headers;

        try {
            const game = await Game.findById(gameId)
                .populate("questionCategory")
                .populate("levels");

            if (!game) {
                return res.status(404).json({success: false, message: "Game not found."});
            }

            const isValidCategory = Array.isArray(game.questionCategory)
                ? game.questionCategory.some((cat) => cat._id.toString() === selectedCategory)
                : game.questionCategory?._id?.toString() === selectedCategory;

            if (!isValidCategory) {
                return res.status(400).json({success: false, message: "Invalid category selected."});
            }

            const {minParticipants, maxParticipants} = game;

            let round = await GameRound.findOne({
                "participants.customer": {$ne: userId},
                status: "pending",
                $expr: {$lt: [{$size: "$participants"}, maxParticipants]},
            });
            console.log("round", round)
// return;
            if (!round) {
                const questionsByLevel = [];
                const levelsForParticipant = [];

                for (const level of game.levels) {
                    const levelQuestions = await Question.find({
                        questionCategory: selectedCategory,
                        level: level.levelNumber,
                    }).limit(level.numberOfQuestions);

                    if (levelQuestions.length < level.numberOfQuestions) {
                        return res.status(400).json({
                            success: false,
                            message: `Not enough questions for level ${level.levelNumber}.`,
                        });
                    }

                    questionsByLevel.push({
                        levelNumber: level.levelNumber,
                        questions: levelQuestions.map((q) => ({
                            question: q._id,
                            level: level.levelNumber,
                        })),
                    });

                    levelsForParticipant.push({
                        levelNumber: level.levelNumber,
                        answers: [],
                    });
                }

                round = new GameRound({
                    status: "pending",
                    questions: questionsByLevel,
                    participants: [
                        {
                            customer: userId,
                            score: 0,
                            accuracy: 0,
                            levels: levelsForParticipant,
                        },
                    ],
                });

                await round.save();
                game.gameRounds.push(round._id);
                await game.save();
            } else {
                const levelsForParticipant = game.levels.map((level) => ({
                    levelNumber: level.levelNumber,
                    answers: [],
                }));

                round.participants.push({
                    customer: userId,
                    score: 0,
                    accuracy: 0,
                    levels: levelsForParticipant,
                });
                await round.save();
            }

            res.status(200).json({
                success: true,
                message: "GameRound successfully joined or created.",
                gameRound: round,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to start or join game round.",
                error: error.message,
            });
        }

    },
    answer: async function (req, res, next) {
        const GameRound = req.mongoose.model("GameRound");
        const Customer = req.mongoose.model("Customer");
        const Game = req.mongoose.model("Game");
        const Question = req.mongoose.model("Question");
        const calculateAccuracy = (answers) => {
            if (!answers || answers.length === 0) return 0;
            const correctAnswers = answers.filter(answer => answer.isCorrect).length;
            return (correctAnswers / answers.length) * 100; // returns percentage accuracy
        };
        const {gameId, roundId, answers, action} = req.body;

        if (!gameId || !roundId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({success: false, message: "Invalid request data."});
        }

        try {
            // Fetch the round and its associated questions
            const round = await GameRound.findById(roundId).populate({
                path: "questions.questions", // Ensure the question data is populated correctly
                populate: {path: "question", model: "Question"} // Populate the options field as well
            });

            if (!round) return res.status(404).json({success: false, message: "Round not found."});

            // Log the round structure to see what data is available
            console.log("Round structure:", round);

            const customer = await Customer.findById(req.headers._id);
            if (!customer) return res.status(404).json({success: false, message: "Customer not found."});

            // Find the participant for the customer
            const participant = round.participants.find(p => p.customer.toString() === customer._id.toString());
            if (!participant) return res.status(404).json({success: false, message: "Participant not found."});

            // Ensure participant levels are initialized
            if (!participant.levels || participant.levels.length === 0) {
                participant.levels = round.questions.map(level => ({
                    levelNumber: level.levelNumber,
                    answers: []
                }));
            }

            let correctAnswerId = null;
            let isCorrect = false;

            // Loop through the answers to process them
            for (const answerObj of answers) {
                const {questionId, answer, level, timeTaken} = answerObj;

                // Debugging log to track which level and question we're processing
                console.log(`Processing answer for level: ${level}, questionId: ${questionId}`);

                // Find the corresponding level data
                const levelData = round.questions.find(lvl => lvl.levelNumber === level);
                if (!levelData) {
                    console.log(`Level ${level} not found in round questions`);
                    continue; // Skip if level is not found
                }

                // Log the questions within this level
                console.log(`Level ${level} data:`, levelData);

                // Ensure we're comparing ObjectIds correctly
                const questionData = levelData.questions.find(q => {
                    console.log("q", q, questionId.toString());
                    return (q._id.toString() === questionId.toString())
                });
                if (!questionData) {
                    console.log(`Question ${questionId} not found in level ${level}`);
                    continue; // Skip if question is not found
                }

                const question = questionData.question; // Get the populated question data

                // Log the question and its options to verify correct data
                console.log("Question Data:", question);
                console.log("Options:", question.options);

                // Find the correct answer from the question options
                const correctOption = question.options.find(option => option.isAnswer);
                if (correctOption) {
                    correctAnswerId = correctOption._id.toString(); // Ensure it's a string
                    isCorrect = answer.trim() === correctAnswerId.trim();
                } else {
                    console.error(`Correct answer not found for question: ${questionId}`);
                }

                // Ensure the level exists in participant's levels
                const participantLevel = participant.levels.find(lvl => lvl.levelNumber === level);
                if (!participantLevel) {
                    console.log(`Participant level ${level} not found, initializing.`);
                    participant.levels.push({
                        levelNumber: level,
                        answers: []
                    });
                }

                // Get the current level after initialization (if necessary)
                const currentLevel = participant.levels.find(lvl => lvl.levelNumber === level);

                // Check if this question's answer already exists
                const existingAnswerIndex = currentLevel.answers.findIndex(ans => ans.question.toString() === question._id.toString());

                if (existingAnswerIndex !== -1) {
                    // Update the existing answer
                    currentLevel.answers[existingAnswerIndex] = {
                        question: question._id,
                        answer,
                        isCorrect,
                        timeTaken
                    };
                } else {
                    // Push the new answer if not already present
                    currentLevel.answers.push({
                        question: question._id,
                        answer,
                        isCorrect,
                        timeTaken
                    });
                }

                // Update participant score if the answer is correct
                if (isCorrect) participant.score += 1;
            }

            // Save the updated participant data back to the round
            await round.save();

            // Respond with the result
            res.json({
                success: true,
                message: "Answers submitted successfully.",
                correctAnswerId,
                correct: isCorrect
            });

        } catch (error) {
            console.error("Error processing answers:", error);
            res.status(500).json({success: false, message: "Server error."});
        }

    }


});
export default self;
