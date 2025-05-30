import _ from 'lodash'

var self = ({
    create: async function (req, res, next) {
        console.log("Let's send notification...");

        const Notification = req.mongoose.model('Notification');
        const Settings = req.mongoose.model('Settings');
        const Gateway = req.mongoose.model('Gateway');

        // Remove _id if present
        delete req.body._id;

        // Validate required fields
        if (!req.body.message) {
            return res.json({success: false, message: 'Enter message!'});
        }

        if (!req.body.phoneNumber) {
            return res.json({success: false, message: 'Enter phoneNumber!'});
        }

        const obj = {message: req.body.message, phoneNumber: req.body.phoneNumber};

        try {
            // Retrieve settings to get default SMS gateway
            const settings = await Settings.findOne({}, 'defaultSmsGateway');
            if (!settings || !settings.defaultSmsGateway) {
                return res.json({success: false, message: 'No default SMS gateway found!'});
            }

            // Retrieve gateway using defaultSmsGateway
            const gateway = await Gateway.findById(settings.defaultSmsGateway);
            if (!gateway || !gateway.request) {
                return res.json({success: false, gateway: gateway});
            }

            // Create notification
            const notification = await Notification.create(obj);
            if (!notification) {
                return res.json({success: false, message: 'Error creating notification!'});
            }

            // Handle phone number and message replacement
            let message = gateway.request;

            if (req.body.message) message = message.replaceAll("%message%", req.body.message);
            if (req.body.phoneNumber) message = message.replaceAll("%phoneNumber%", req.body.phoneNumber);

            console.log('Message:', message);
            // message = message.replace(/(?:\r\n|\r|\n)/g, '\\n');
            message = message.replace(/(\r\n|\n|\r)/g, '\\n');
            // message = message
            //     .replace(/\\/g, '\\\\')    // Escape backslashes
            //     .replace(/"/g, '\\"')       // Escape double quotes
            //     .replace(/\n/g, '\\n')      // Escape newlines
            //     .replace(/\r/g, '\\r').replace(/\u200B/g, '\\u200B');
            const requestPayload = JSON.parse(message);

            try {
                console.log('Parsed payload:', requestPayload);

                const parsedBody = await req.httpRequest(requestPayload);
                console.log('Parsed Body:', parsedBody);
                return res.json(notification);
            } catch (e) {
                console.error('Error in HTTP request:', e);
                return res.json({success: false, error: e, requestPayload});
            }


            return res.json(notification);

        } catch (err) {
            console.error('Error in create function:', err);
            return res.json({success: false, message: 'Internal server error!'});
        }
    },

    createOld: function (req, res, next) {
        console.log('let create...')

        let Notification = req.mongoose.model('Notification');
        let Settings = req.mongoose.model('Settings');
        let Gateway = req.mongoose.model('Gateway');
        delete req.body._id
        if (!req.body.message) {
            return res.json({
                success: false,
                message: 'enter message!'
            });

        }
        let obj = {
            message: req.body.message
        }
        if (req.body.limit) {
            obj["limit"] = req.body.limit
        }
        if (req.body.customerGroup) {
            obj["customerGroup"] = req.body.customerGroup
        }
        if (req.body.source) {
            obj["source"] = req.body.source
        }
        if (req.body.offset) {
            obj["offset"] = req.body.offset
        }
        if (req.body.phoneNumber) {
            obj["phoneNumber"] = req.body.phoneNumber
        }
        Notification.create(obj, function (err, notification) {
            if (err || !notification) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            Settings.findOne({}, 'defaultSmsGateway', function (err, settings) {
                if (err || !settings || (settings && !settings.defaultSmsGateway)) {
                    //send with default gateway
                    return
                }

                if (settings && settings.defaultSmsGateway) {
                    //send with custom gateway
                    Gateway.findById(settings.defaultSmsGateway, function (err, gateway) {
                        if (err || !gateway || (gateway && !gateway.request)) {

                            //send with default gateway
                            return res.json({
                                err: err,
                                success: false,
                                gateway: gateway
                            })

                        }
                        // console.log('theReq', theReq)


                        if (req.body.phoneNumber && !req.body.source && !req.body.customerGroup) {
                            let m = gateway.request;
                            if (req.body.message)
                                m = m.replaceAll("%message%", req.body.message);
                            if (req.body.phoneNumber)
                                m = m.replaceAll("%phoneNumber%", req.body.phoneNumber);
                            console.log('m:', m)

                            let theReq = JSON.parse(m);

                            req.httpRequest(theReq).then(function (parsedBody) {
                                console.log('parsedBody', parsedBody)
                                // {
                                //     success: true,
                                //         data
                                // :
                                //     (parsedBody && parsedBody['data']) ? parsedBody['data'] : '',
                                // ...
                                // }
                                return res.json(
                                    notification
                                );

                            }).catch(e => res.json({e, requ: theReq}));
                        }
                        if (!req.body.phoneNumber && req.body.source && !req.body.customerGroup) {
                            let Customer = req.mongoose.model('Customer');
                            // source: req.body.source
                            let d = 0
                            // console.log('req.body.offset',req.body.offset)
                            // return
                            console.log('from source:', req.body.source);
                            let i = 0;
                            Customer.find({source: req.body.source}, function (err, customers) {
                                _.forEach(customers, function (customer, i) {
                                    let m = gateway.request;
                                    if (req.body.message)
                                        m = m.replaceAll("%message%", req.body.message);
                                    console.log('phoneNumber', customer.phoneNumber)
                                    if (customer.phoneNumber)
                                        m = m.replaceAll("%phoneNumber%", customer.phoneNumber);
                                    if (customer.firstName) {
                                        m = m.replaceAll("%firstName%", customer.firstName);
                                    }
                                    if (!customer.firstName) {
                                        m = m.replaceAll("%firstName%", "دوست");
                                    }

                                    console.log('m', m);
                                    let theReq = JSON.parse(m);

                                    req.httpRequest(theReq).then(function (parsedBody) {
                                        i++;
                                        if (parsedBody && parsedBody['data'])
                                            console.log('parsedBody i:', i, parsedBody['data'])


                                    }).catch(e => {
                                        console.log('error', e)
                                        // res.json({e, requ: theReq})
                                    });
                                    // return res.json({
                                    //     success: true,
                                    //     // data: (parsedBody && parsedBody['data']) ? parsedBody['data'] : ''
                                    // });
                                })
                            }).skip(req.body.offset || 0).limit(req.body.limit || 1000)

                        }
                        if (!req.body.phoneNumber && !req.body.source && req.body.customerGroup) {
                            let Customer = req.mongoose.model('Customer');
                            // source: req.body.source
                            let d = 0
                            // console.log('req.body.offset',req.body.offset)
                            // return
                            console.log('from customerGroup:', req.body.customerGroup);
                            let i = 0;
                            Customer.find({customerGroup: req.body.customerGroup}, function (err, customers) {
                                _.forEach(customers, function (customer, i) {
                                    let m = gateway.request;
                                    if (req.body.message)
                                        m = m.replaceAll("%message%", req.body.message);
                                    console.log('phoneNumber', customer.phoneNumber, customer.customerGroup)
                                    if (customer.phoneNumber)
                                        m = m.replaceAll("%phoneNumber%", customer.phoneNumber);
                                    if (customer.firstName) {
                                        m = m.replaceAll("%firstName%", customer.firstName);
                                    }
                                    if (!customer.firstName) {
                                        m = m.replaceAll("%firstName%", "دوست");
                                    }

                                    console.log('m', m);
                                    let theReq = JSON.parse(m);

                                    req.httpRequest(theReq).then(function (parsedBody) {
                                        i++;
                                        if (parsedBody && parsedBody['data'])
                                            console.log('parsedBody i:', i, parsedBody['data'])


                                    }).catch(e => {
                                        console.log('error', e)
                                        // res.json({e, requ: theReq})
                                    });
                                    // return res.json({
                                    //     success: true,
                                    //     // data: (parsedBody && parsedBody['data']) ? parsedBody['data'] : ''
                                    // });
                                })
                            }).skip(req.body.offset || 0).limit(req.body.limit || 1000)

                        }
                        if (!req.body.phoneNumber && !req.body.source && !req.body.customerGroup) {
                            let Customer = req.mongoose.model('Customer');
                            // source: req.body.source
                            Customer.find({source: req.body.source}, function (err, customers) {
                                _.forEach(customers, function (customer, i) {
                                    let m = gateway.request;
                                    if (req.body.message)
                                        m = m.replaceAll("%message%", req.body.message);
                                    console.log('phoneNumber', customer.phoneNumber)
                                    if (customer.phoneNumber)
                                        m = m.replaceAll("%phoneNumber%", customer.phoneNumber);
                                    if (customer.firstName) {
                                        m = m.replaceAll("%firstName%", customer.firstName);
                                    }
                                    if (!customer.firstName) {
                                        m = m.replaceAll("%firstName%", "دوست");
                                    }

                                    console.log('m', m);
                                    // req.httpRequest(theReq).then(function (parsedBody) {
                                    //     console.log('parsedBody', parsedBody)
                                    //
                                    //     return res.json({
                                    //         success: true,
                                    //         data: (parsedBody && parsedBody['data']) ? parsedBody['data'] : ''
                                    //     });
                                    //
                                    // }).catch(e => res.json({e, requ: theReq}));
                                })
                            }).skip(0).limit(1000)

                        }


                    })
                } else {
                    return res.json({
                        success: false,
                        message: 'set default sms gateway!'
                    })
                }

            })
            // return 0;

        });
    },

});
export default self;