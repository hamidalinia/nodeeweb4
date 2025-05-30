let self = ({

    createSampleQuestions: async function (req, res, next) {
        const QuestionCategory = req.mongoose.model('QuestionCategory');
        let Question = req.mongoose.model('Question');

        QuestionCategory.findById(req.body.categoryId,
            function (err, questionCategories) {
                if (err || !questionCategories) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                if (questionCategories?.name?.fa) {
                    let x = {
                        "title": {"fa": "کدام یک از موارد زیر نیازمند بیمه صادراتی است؟"},
                        "questionCategory": [questionCategories._id],
                        "status": "published",
                        "score": 1,
                        "options": [{
                            "answer": "کالاهای با ریسک بالا",
                            "isAnswer": true,
                        }, {"answer": "کالاهای ارزان‌قیمت", "isAnswer": false,}, {
                            "answer": "محصولات داخلی",
                            "isAnswer": false,
                        }, {"answer": "محصولات بدون ارزش افزوده", "isAnswer": false,}]
                    };
                    let q = "create me 20 sample questions with 4 answers (that only one answer can be correct, the 3 other should be incorrect, do not create question with two correct answers!) in category " + questionCategories?.name?.fa + " in shape and structure like:";
                    q += (JSON.stringify(x))+" , also questionCategory in this json should be exactly What I have exampled and only answer in json format and do not say anything else";
                    const encodedQuery = encodeURIComponent(q);
                    let url = req.global.domain + '/customer/gateway/ai/chat?q=' + encodedQuery
                    req.httpRequest({
                        method: "get",
                        url: url
                    }).then(async function (response) {
                        // console.log("response", response.data.candidates[0].content.parts[0].text)
                        if (response?.data?.candidates[0]?.content?.parts[0]?.text) {
                            let the_response = response?.data?.candidates[0]?.content?.parts[0]?.text;
                            the_response = the_response?.replace("```json", "")
                            the_response = the_response?.replace("```", "")
// Step 2: Parse the cleaned JSON string into an object
                            try {
                                console.log("the_response",the_response)
                                the_response = JSON.parse(the_response);

                                try {
                                    const result = await Question.insertMany(the_response);
                                    return res.status(200).json({
                                        success: true,
                                        message: `${result.length} questions imported successfully!`,
                                        data: result
                                    });
                                } catch (error) {
                                    console.error('Error importing questions:', error);
                                    return res.status(500).json({
                                        success: false,
                                        message: "Failed to import questions.",
                                        error: error.message
                                    });
                                }

                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                                return res.status(500).json({
                                    success: false,
                                    message: "Error parsing JSON",
                                    error: error
                                });

                            }

                        } else {
                            res.json({
                                success: false,
                                message: e
                            });
                        }
                    }).catch(e => {
                        res.json({
                            success: false,
                            message: e
                        });
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'category not found!'
                    });

                }
                return 0;

            });


    }

});
export default self;
