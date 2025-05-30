let self = ({
    getMyCourses: async (req, res, next) => {
        try {
            console.log("Fetching MyCourses...");

            const MyCourse = req.mongoose.model("MyCourse");
            const {_id: customerId} = req.headers;

            // Validate customer ID
            if (!customerId) {
                return res.status(400).json({success: false, message: "Customer ID is required."});
            }

            // Fetch courses for the customer
            const myCourses = await MyCourse.find({customer: customerId})
                .populate("course","title icon courseLength season") // Populates course details
                .lean();

            // Check if courses exist
            if (!myCourses.length) {
                return res.status(404).json({success: false, message: "No courses found."});
            }

            // Send response
            return res.status(200).json({success: true, data: myCourses});
        } catch (error) {
            console.error("Error fetching MyCourses:", error);
            return res.status(500).json({success: false, message: "Internal Server Error."});
        }
    },
    getCourse: function (req, res, next) {
        let Course = req.mongoose.model('Course');
        let MyCourse = req.mongoose.model('MyCourse');

        const {courseId} = req.params;
        const {_id: customerId} = req.headers;

        const mapSeasonLessons = (seasons) => {
            return seasons.map(season => ({
                ...season,
                lessons: season.lessons.map(lesson => ({
                    lessonRef: lesson.lessonRef._id,  // Only include the lessonRef ID
                    title: lesson?.lessonRef?.title,  // Only include the lessonRef ID
                    score: lesson.score || "0"  // Default score if none exists
                }))
            }));
        };

        // Fetch course data
        Course.findById(courseId)
            .populate({
                path: 'season.lessons.lessonRef',
                select: '_id title '  // Only fetch lessonRef ID
            })
            .lean()  // Use lean() to return plain JavaScript objects instead of Mongoose documents
            .exec((err, course) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Server error",
                        error: err
                    });
                }

                if (!course) {
                    return res.status(404).json({
                        success: false,
                        message: "Course not found"
                    });
                }

                // Check if MyCourse exists
                MyCourse.findOne({course: course._id, customer: customerId})
                    .lean()  // Use lean() to return plain JavaScript objects instead of Mongoose documents
                    .populate('course', 'title _id icon')
                    .exec((err, myCourse) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Server error",
                                error: err
                            });
                        }

                        if (myCourse) {
                            return res.json({
                                success: true,
                                message: "MyCourse found",
                                myCourse: {
                                    ...myCourse,
                                    season: mapSeasonLessons(myCourse.season)  // Map seasons and lessons
                                },
                                courseSeason: mapSeasonLessons(course.season)  // Map course seasons and lessons
                            });
                        }

                        // Create a new MyCourse entry
                        const newMyCourse = new MyCourse({
                            course: course._id,
                            customer: customerId,
                            seasonScoredata: [],
                            season: []
                        });

                        // Save new MyCourse
                        newMyCourse.save((err, savedMyCourse) => {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to create MyCourse",
                                    error: err
                                });
                            }

                            return res.json({
                                success: true,
                                message: "MyCourse created",
                                myCourse: {
                                    ...savedMyCourse.toObject(),
                                    season: mapSeasonLessons(savedMyCourse.season)  // Map seasons and lessons
                                },
                                courseSeason: mapSeasonLessons(course.season)  // Map course seasons and lessons
                            });
                        });
                    });
            });
    }

});
export default self;
