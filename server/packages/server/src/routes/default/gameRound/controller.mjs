import _ from 'lodash'
import path from 'path'
import mime from 'mime'
import fs from 'fs'
import https from 'https'
import requestIp from "request-ip";

let self = ({

    allRound: async function (req, res, next) {
        const { _id: customerId } = req.headers; // Extract customer ID from headers
        let GameRound = req.mongoose.model('GameRound');

        try {
            // Fetch all rounds where the customer is a participant
            const rounds = await GameRound.find({
                participants: {
                    $elemMatch: { customer: customerId }, // Check if the customer is a participant
                },
            })
                .populate("participants.customer", "firstName lastName photos _id")
                .sort({ createdAt: -1 })
                .lean(); // Ensure we are working with lean objects

            if (!rounds.length) {
                return res.status(200).json({
                    success: false,
                    message: "No rounds found for this customer.",
                    rounds: []
                });
            }

            // Format and process each round
            const formattedRounds = await Promise.all(rounds.map(async (round) => {
                const levels = round.levels || [];  // Ensure levels is an array, default to empty if undefined
                const totalLevels = levels.length;
                const playedLevels = levels.filter(level => level.status === "played").length;
                const pendingLevels = totalLevels - playedLevels;

                const questions = round.questions || [];  // Ensure questions is an array, default to empty if undefined
                let isRoundComplete = true; // Track if the round is complete

                // Loop through participants
                for (let index = 0; index < round.participants.length; index++) {
                    const par = round.participants[index];

                    // Update photos once for each participant, outside the levels loop
                    const pl = par?.customer?.photos?.length;
                    if (par.customer.photos[pl - 1]) {
                        round.participants[index].customer.photos = par.customer.photos[pl - 1]; // Update with the last photo
                    }
// if(insta)
                    const levels = par?.levels;
                    let participantScore = 0; // Initialize participant's score

                    if (levels) {
                        levels.forEach((level) => {
                            // Check if all answers are provided for this level
                            if (level?.answers && level.answers.length > 0) {
                                let unansweredQuestions = level.answers.filter(answer => !answer.isCorrect && !answer.answer);
                                if (unansweredQuestions.length > 0) {
                                    isRoundComplete = false; // Mark round as incomplete if unanswered questions exist
                                }

                                // Accumulate score for this participant
                                level.answers.forEach((answer) => {
                                    if (answer.isCorrect) {
                                        participantScore += 1; // Increase score by 1 if the answer is correct
                                    }
                                });
                            } else {
                                isRoundComplete = false; // If no answers for the level, round is incomplete
                            }
                        });
                    } else {
                        isRoundComplete = false; // If no levels exist, round is incomplete
                    }

                    // Assign the accumulated score to the participant
                    round.participants[index].score = participantScore;
                }

                // If all participants have answered all questions, mark round as "completed"
                if (isRoundComplete) {
                    await GameRound.findOneAndUpdate(
                        { _id: round._id }, // Find the round by its ID
                        { $set: { status: "completed" } }, // Update the round status to 'completed'
                        { new: true } // Return the updated document
                    );
                }

                // Return the formatted round data
                return {
                    roundId: round._id,
                    roundNumber: round.roundNumber,
                    status: round.status,
                    participants: round.participants,
                    totalLevels,
                    playedLevels,
                    pendingLevels,
                    levels: levels.map((level) => ({
                        levelId: level._id,
                        levelNumber: level.levelNumber,
                        status: level.status,
                    })),
                    // Optionally, you can include questions or additional fields
                    // questions: questions.map((q) => ({
                    //     questionId: q._id,
                    //     text: q.text,
                    // })),
                };
            }));

            return res.status(200).json({
                success: true,
                message: "Rounds retrieved successfully.",
                rounds: formattedRounds,
            });
        } catch (error) {
            console.error("Error fetching rounds:", error);
            return res.status(200).json({
                success: false,
                message: "Failed to fetch rounds.",
                error: error.message,
            });
        }


    },
    answer: async function (req, res, next) {
        try {
            const { gameId, customerId, questionId, answer, timeTaken } = req.body;

            const game = await Game.findById(gameId).populate('questions.question');

            if (!game) {
                return res.status(400).json({ error: 'Game not found' });
            }

            // Check if the game is still active
            if (new Date() > game.endTime) {
                return res.status(400).json({ error: 'Game has ended' });
            }

            // Find the question in the game
            const questionEntry = game.questions.find(
                (q) => q.question._id.toString() === questionId
            );

            if (!questionEntry) {
                return res.status(400).json({ error: 'Question not found in this game' });
            }

            // Add the customer's answer
            questionEntry.answers.push({ customerId, answer, timeTaken });

            await game.save();

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    join: async function (req, res, next) {
        let Game = req.mongoose.model('Game');
        if (req.headers.response !== "json") {
            return res.show()

        }
        try {
            const { customerId } = req.body;

            // Find an existing game with one customer
            let game = await Game.findOne({ status: 'waiting' });

            if (game) {
                // Add the second customer and start the game
                game.customers.push(customerId);
                game.status = 'in-progress';
                game.startTime = new Date();
                game.endTime = new Date(Date.now() + game.timeLimit * 1000); // Set end time (7 hours later)
                await game.save();
            } else {
                // Create a new game with this customer
                game = new Game({ customers: [customerId] });
                await game.save();
            }

            res.json(game);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

});
export default self;
