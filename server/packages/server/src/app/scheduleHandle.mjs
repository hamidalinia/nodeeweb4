import CronJob from "node-cron";
import global from "#root/global";
import mongoose from "mongoose";
import axios from "axios";

const initScheduledJobs2 = (props) => {
};
const initScheduledJobs = (props) => {
    console.log("initScheduledJobs new time", new Date());
    if (!props.schedules) props.schedules = [];
    let scTemp = [];
    // Iterate over schedules if they exist
    console.log("props?.schedules", props?.schedules);
    props?.schedules?.forEach((item, i) => {
        console.log('item for schedule', item, i);

        // Ensure both path and variable exist in the item
        if (item.path && item.variable) {
            global.getSetting("plugins")
                .then((r) => {
                    console.log('my setting r:', r);
                    console.log('my setting item.path, r[item.path]:', item.path, r[item.path]);

                    // Check if r[item.path] exists
                    if (!r[item.path]) {
                        console.error(`Setting for ${item.path} not found.`);
                        return;
                    }

                    // Get the cron expression for the item
                    const cronExpression = r[item.path]?.[item.variable] || item.setting || "* * * * * *"; // Default cron if not found
                    console.log('Using cronExpression:', cronExpression);

                    // If CronJob is available, schedule the job
                    if (CronJob) {
                        scTemp[i] = CronJob.schedule(cronExpression, () => {
                            console.log("cronjob by plugin...:", item.name, item.setting);
                            global.fireEvent(item.name, {}, props, {
                                mongoose,
                                httpRequest: axios,
                                global: global,
                            });
                        }, {
                            timezone: process.env.TZ || "Asia/Tehran",
                            scheduled: false,
                        });

                        // Start the scheduled cron job
                        scTemp[i].start();
                    }
                })
                .catch(e => {
                    console.error("Error fetching settings:", e);
                });
        }
    });

// Define a scheduled job to run at midnight daily
    const scheduledJobFunction = CronJob?.schedule("0 0 0 * * *", () => {
        console.log("new time", new Date());

        // Trigger event to send schedule message by system
        global.fireEvent("send-schedule-message-by-system", {}, props, {
            mongoose,
            httpRequest: axios,
            global: global,
        });
    }, {
        timezone: process.env.TZ || "Asia/Tehran",
    });

// Start the scheduled job
    scheduledJobFunction?.start();

    // console.log("props?.schedules",props?.schedules)
    // props?.schedules?.forEach((item, i) => {
    //     console.log('item for schedule',item,i)
    //     // console.log('item.action', item.action)
    //     if (item.path && item.variable) {
    //         global.getSetting("plugins").then((r) => {
    //             console.log('my setting r:', r);
    //             console.log('my setting item.path,r[item.path]:', item.path, r[item.path]);
    //             console.log('my setting item.variable:', r[item.path][item.variable]);
    //             if(!r[item.path]){
    //
    //             }
    //             if (!item.setting) {
    //                 item.setting = "* * * * * *";
    //             }
    //             console.log('item.setting', item.setting)
    //             console.log('r[item.path][item.variable]' +
    //                 '                            ? r[item.path][item.variable]' +
    //                 '                            : item.setting', r[item.path][item.variable]
    //                 ? r[item.path][item.variable]
    //                 : item.setting)
    //             if (CronJob) {
    //                 scTemp[i] = CronJob?.schedule(
    //                     r[item.path][item.variable]
    //                         ? r[item.path][item.variable]
    //                         : item.setting,
    //                     () => {
    //                         console.log("cronjob by plugin...:", item.name, item.setting);
    //                         global.fireEvent(item.name, {}, props, {
    //                             mongoose,
    //                             httpRequest: axios,
    //                             global: global,
    //                         });
    //                         // item.function=
    //                     },
    //                     {
    //                         timezone: process.env.TZ || "Asia/Tehran",
    //                         scheduled: false,
    //                     }
    //                 );
    //                 // .start();
    //                 scTemp[i].start();
    //             }
    //             // }
    //         }).catch(e => {
    //             console.log("setting not found", e);
    //             return false;
    //         });
    //     }
    // });
    // const scheduledJobFunction = CronJob?.schedule(
    //     "0 0 0 * * *",
    //     () => {
    //         // const scheduledJobFunction = CronJob.schedule("0,15,30,45 * * * * *", () => {
    //         // process.env.TZ="Asia/Tehran";
    //
    //         console.log("new time", new Date());
    //         // console.log('process.env.TZ',process.env.TZ)
    //
    //         global.fireEvent("send-schedule-message-by-system", {}, props, {
    //             mongoose,
    //             httpRequest: axios,
    //             global: global,
    //         });
    //         // console.log("I'm executed on a schedule!",new Date());
    //         // let functions = [];
    //         // props.entity.forEach((en, d) => {
    //         //     if (en.functions) {
    //         //         en.functions.forEach((fn) => {
    //         //             console.log('fn', fn)
    //         //             functions.push(fn);
    //         //         });
    //         //     }
    //         //     if (en.hook) {
    //         //         en.hook.forEach((hook) => {
    //         //             if (hook.event == event) {
    //         //                 console.log('run event ...', hook.name)
    //         //                 hook.func(req,res,next,params);
    //         //             }
    //         //         });
    //         //     }
    //         // })
    //         // Add your custom logic here
    //     },
    //     {
    //         timezone: process.env.TZ || "Asia/Tehran",
    //     }
    // );
    //
    // scheduledJobFunction.start();

};
export default initScheduledJobs;
