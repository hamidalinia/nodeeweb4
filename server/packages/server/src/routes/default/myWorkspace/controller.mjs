let self = ({
    getMyWorkspaces: async (req, res, next) => {
        try {
            console.log("Fetching MyWorkspaces...");

            const MyWorkspace = req.mongoose.model("MyWorkspace");
            const {_id: customerId} = req.headers;

            // Validate customer ID
            if (!customerId) {
                return res.status(400).json({success: false, message: "Customer ID is required."});
            }

            // Fetch workspaces for the customer
            const myWorkspaces = await MyWorkspace.find({customer: customerId})
                .populate("workspace","title icon workspaceLength season") // Populates workspace details
                .lean();

            // Check if workspaces exist
            if (!myWorkspaces.length) {
                return res.status(404).json({success: false, message: "No workspaces found."});
            }

            // Send response
            return res.status(200).json({success: true, data: myWorkspaces});
        } catch (error) {
            console.error("Error fetching MyWorkspaces:", error);
            return res.status(500).json({success: false, message: "Internal Server Error."});
        }
    },
    getWorkspace: function (req, res, next) {
        let Workspace = req.mongoose.model('Workspace');
        let MyWorkspace = req.mongoose.model('MyWorkspace');

        const {workspaceId} = req.params;
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

        // Fetch workspace data
        Workspace.findById(workspaceId)
            .populate({
                path: 'season.lessons.lessonRef',
                select: '_id title '  // Only fetch lessonRef ID
            })
            .lean()  // Use lean() to return plain JavaScript objects instead of Mongoose documents
            .exec((err, workspace) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Server error",
                        error: err
                    });
                }

                if (!workspace) {
                    return res.status(404).json({
                        success: false,
                        message: "Workspace not found"
                    });
                }

                // Check if MyWorkspace exists
                MyWorkspace.findOne({workspace: workspace._id, customer: customerId})
                    .lean()  // Use lean() to return plain JavaScript objects instead of Mongoose documents
                    .populate('workspace', 'title _id icon')
                    .exec((err, myWorkspace) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Server error",
                                error: err
                            });
                        }

                        if (myWorkspace) {
                            return res.json({
                                success: true,
                                message: "MyWorkspace found",
                                myWorkspace: {
                                    ...myWorkspace,
                                    season: mapSeasonLessons(myWorkspace.season)  // Map seasons and lessons
                                },
                                workspaceSeason: mapSeasonLessons(workspace.season)  // Map workspace seasons and lessons
                            });
                        }

                        // Create a new MyWorkspace entry
                        const newMyWorkspace = new MyWorkspace({
                            workspace: workspace._id,
                            customer: customerId,
                            seasonScoredata: [],
                            season: []
                        });

                        // Save new MyWorkspace
                        newMyWorkspace.save((err, savedMyWorkspace) => {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to create MyWorkspace",
                                    error: err
                                });
                            }

                            return res.json({
                                success: true,
                                message: "MyWorkspace created",
                                myWorkspace: {
                                    ...savedMyWorkspace.toObject(),
                                    season: mapSeasonLessons(savedMyWorkspace.season)  // Map seasons and lessons
                                },
                                workspaceSeason: mapSeasonLessons(workspace.season)  // Map workspace seasons and lessons
                            });
                        });
                    });
            });
    }

});
export default self;
