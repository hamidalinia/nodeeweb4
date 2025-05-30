import axios from 'axios'

export default (props) => {
    // console.log("taraGateway",props);

    const base = 'https://pay.tara360.ir';

    // _.forEach()
    if (props && props.entity)
        props.entity.map((item, i) => {
            if (item.name === 'gateway') {
                if (item.routes)
                    item.routes.push({
                        'path': '/tara/getToken',
                        'method': 'post',
                        'access': 'customer_all',
                        'controller': async (req, res, next) => {
                            let Order = req.mongoose.model('Order');
                            let Settings = req.mongoose.model('Settings');
                            if (!req?.body?.username || !req?.body?.password || !req?.body?.service_id || !req?.body?.callBackUrl) {
                                return res.json({
                                    success: false,
                                    message: 'username or password or service_id or callBackUrl is not entered!'
                                })
                            }
                            const loginData = {
                                username: req?.body?.username,
                                password: req?.body?.password
                            };
                            const service_id = req?.body?.service_id;
                            const orderId = req?.body?.orderId;
                            console.log('tara req,body', req.body);

// Function to authenticate and get accessToken
                            const authenticate = async () => {
                                console.log("authenticate")


                                try {
                                    const response = await axios.post(`${base}/pay/api/v2/authenticate`, loginData, {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    });

                                    // Store the access token (You can save it in memory or localStorage based on your environment)
                                    const accessToken = response?.data?.accessToken;
                                    const expireTime = response?.data?.expireTime;
                                    console.log('Access Token:', accessToken);
                                    return {accessToken, expireTime};
                                } catch (error) {
                                    console.error('Error during authentication:', error);
                                    return null; // Return null if authentication fails
                                }
                            };

// Function to fetch club groups using accessToken
                            const fetchClubGroups = async (accessToken) => {
                                try {
                                    const response = await axios.post(`${base}/pay/api/clubGroups`, {}, {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${accessToken}`
                                        }
                                    });

                                    console.log('ipgClubMerchandiseGroupReportList:', response.data.ipgClubMerchandiseGroupReportList);
                                } catch (error) {
                                    console.error('Error during fetching club groups:', error);
                                }
                            };

// Function to get the access token from the database
                            const getOrderFromDB = async () => {
                                return new Promise((resolve, reject) => {
                                    Order.findById(orderId, (err, order) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(order);
                                        }
                                    });
                                });
                            };

// Function to get the access token from the database
                            const getAccessTokenFromDB = async () => {
                                return new Promise((resolve, reject) => {
                                    Settings.findOne({}, 'plugins', (err, setting) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            const expireTime = setting?.plugins?.['tara-gateway']?.expireTime;
                                            const accessToken = setting?.plugins?.['tara-gateway']?.accessToken;
                                            resolve({accessToken, expireTime});
                                        }
                                    });
                                });
                            };

// Function to save the access token back into the database
                            const saveAccessTokenToDB = async (accessToken, expireTime) => {
                                return new Promise((resolve, reject) => {
                                    Settings.findOneAndUpdate(
                                        {},
                                        {
                                            $set: {
                                                'plugins.tara-gateway.accessToken': accessToken,
                                                'plugins.tara-gateway.expireTime': expireTime
                                            }
                                        },
                                        {new: true},  // Return the updated document
                                        (err, setting) => {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                resolve(setting);
                                            }
                                        }
                                    );
                                });
                            };


                            const getPurchaseToken = async (accessToken, order) => {
                                console.log("getPurchaseToken with order",)
                                const formatPhoneNumber = (phoneNumber) => {
                                    return phoneNumber.replace(/^98/, '0');
                                };
                                try {
                                    let taraInvoiceItemList=order?.card.map((item) => ({
                                        name: (item?.title && item?.title?.fa) ? item.title.fa : "Unknown Product", // Assuming title exists in item
                                        code: item._id.toString(), // Using the _id as the product code
                                        count: item.count, // Count from the card item
                                        unit: 5, // Unit price from the card item
                                        fee: item.salePrice ? item.salePrice : item.price, // If there's a sale price, use it, otherwise, use the regular price
                                        group: "18", // Example value, you can modify as necessary
                                        groupTitle: "آرایشی و بهداشتی", // Example value, you can modify as necessary
                                        // data: "additional-info", // Example additional data field
                                    }))
                                    taraInvoiceItemList.push({
                                        name: "هزینه ارسال", // Assuming title exists in item
                                        code: "11", // Using the _id as the product code
                                        count: 1, // Count from the card item
                                        unit: 5, // Unit price from the card item
                                        fee: (parseInt(order?.deliveryPrice) * 10), // If there's a sale price, use it, otherwise, use the regular price
                                        group: "40", // Example value, you can modify as necessary
                                        groupTitle: "حمل و نقل", // Example value, you can modify as necessary
                                        // data: "additional-info", // Example additional data field
                                    });
                                    const payload = {
                                        ip: req.ip,
                                        serviceAmountList: [
                                            {
                                                serviceId: service_id,
                                                amount: (parseInt(order?.amount) * 10)
                                            }
                                        ],
                                        taraInvoiceItemList:taraInvoiceItemList ,
                                        // additionalData: "some-additional-data",
                                        callBackUrl: req?.body?.callBackUrl,
                                        amount: (parseInt(order?.amount) * 10),
                                        mobile: formatPhoneNumber(order?.customer_data?.phoneNumber),
                                        orderId: order?._id,
                                        // vat: 900 // مالیات
                                    };
                                    console.log("accessToken", accessToken)
                                    console.log("req?.body?.callBackUrl", req?.body?.callBackUrl)
                                    const response = await axios.post(
                                        `${base}/pay/api/getToken`,
                                        payload,
                                        {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${accessToken}`
                                            }
                                        }
                                    );

                                    console.log('Purchase Token Response:', response.data);
                                    return response.data.token;
                                } catch (error) {
                                    console.error('Error during getToken request:', error.response);
                                    return null;
                                }
                            };

// Main function to authenticate, get or save the token, and fetch the club groups

                            try {
                                // Step 1: Get the access token from the database
                                let {accessToken, expireTime} = await getAccessTokenFromDB();
                                // console.log("accessToken", accessToken)
                                // Step 2: If no access token is found, authenticate and save the new token
                                //if expireTime is passed
                                console.log("Date.now() > expireTime",(Date.now() > expireTime))
                                if (!accessToken || Date.now() > expireTime) {
                                    console.log('No access token found or the token has expired. Authenticating...');

                                    let {accessToken: newAccessToken, expireTime: newExpireTime} = await authenticate();
                                    accessToken = newAccessToken
                                    console.log("expireTime", newExpireTime);
                                    if (newAccessToken && newExpireTime) {
                                        // Step 3: Save the new access token back to the database
                                        await saveAccessTokenToDB(newAccessToken, newExpireTime);
                                    } else {
                                        console.error('Unable to get a new access token.');
                                        return;
                                    }
                                }

                                // Step 4: Use the access token to fetch club groups
                                // await fetchClubGroups(accessToken);
                                const order = await getOrderFromDB();
                                const token = await getPurchaseToken(accessToken, order);
                                // console.log('Purchase Token:', token);
                                console.log('Purchase Token:', {
                                    success: true,
                                    token: token,
                                    username: loginData?.username,
                                    theUrl: `${base}/pay/api/ipgPurchase`,
                                    method: "tara"
                                });
                                return res.json({
                                    success: true,
                                    token: token,
                                    username: loginData?.username,
                                    theUrl: `${base}/pay/api/ipgPurchase`,
                                    method: "tara"
                                })
                            } catch (error) {
                                return res.json({
                                    success: false,
                                    error: error
                                })
                                // console.error('Error:', error);
                            }

                        },
                    });
            }
            if (item.name === 'transaction') {
                if (item.routes)
                    item.routes.push({
                        'path': '/callback/tara/',
                        'method': 'post',
                        'access': 'customer_all',
                        'controller': async (req, res, next) => {
                            let Transaction = req.mongoose.model('Transaction');
                            let Order = req.mongoose.model('Order');
                            let Settings = req.mongoose.model('Settings');
                            const getAccessTokenFromDB = async () => {
                                return new Promise((resolve, reject) => {
                                    Settings.findOne({}, 'plugins', (err, setting) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            const expireTime = setting?.plugins?.['tara-gateway']?.expireTime;
                                            const accessToken = setting?.plugins?.['tara-gateway']?.accessToken;
                                            resolve({accessToken, expireTime});
                                        }
                                    });
                                });
                            };
                            let {result, desc, token, channelRefNumber, additionalData, orderId, pan} = req.body;

                            const purchaseVerify = async (token) => {
                                try {
                                    let {accessToken} = await getAccessTokenFromDB();
                                    console.log("accessToken", accessToken)
                                    // Prepare the request data
                                    const data = {
                                        token: token,  // The token received from the payment gateway
                                        ip: req?.ip,  // The unique order ID
                                        // Other parameters like result, description, etc. (use appropriate values here)
                                    };

                                    // Send POST request to the API
                                    const response = await axios.post(`${base}/pay/api/purchaseVerify`, data, {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${accessToken}`  // Include the bearer token for authorization
                                        }
                                    });

                                    return response?.data
                                } catch (error) {
                                    console.error("Error during Purchase Inquiry API call:", error);
                                    // Handle error (e.g., log, retry, or show error message to user)
                                }
                            };
                            const updateOrderStatus = async (orderId) => {
                                return new Promise((resolve, reject) => {
                                    Order.findByIdAndUpdate(orderId,{
                                        $set: {
                                            paymentStatus:'paid'

                                        }
                                    }, (err, order) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(order);
                                        }
                                    });
                                });
                            };
                            const updateTransactionStatus = async (token,channelRefNumber) => {
                                return new Promise((resolve, reject) => {
                                    Transaction.findOneAndUpdate({ Authority: token },{
                                        $set: {
                                            paymentStatus:'paid',
                                            RefID:channelRefNumber,
                                            status:true,
                                            statusCode:'1'

                                        }
                                    }, (err, order) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(order);
                                        }
                                    });
                                });
                            };
                            const getOrderFromDB = async () => {
                                return new Promise((resolve, reject) => {
                                    Order.findById(orderId, (err, order) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(order);
                                        }
                                    });
                                });
                            };
                            const order = await getOrderFromDB()
                            if (result == 0) {
                                console.log("success payment")
                                if (order?.amount) {
                                    const result = await purchaseVerify(token);
                                    const transaction = await updateTransactionStatus(token,channelRefNumber);
                                    const newOrder = await updateOrderStatus(orderId);
                                    console.log("result", result)
                                }
                                res.redirect(`/transaction/tara?Status=OK&method=tara&orderId=${orderId}&orderNumber=${order?.orderNumber}&channelRefNumber=${channelRefNumber}&token=${token}`);

                            } else {
                                res.redirect(`/transaction/tara?Status=NOK&method=tara&orderId=${orderId}&orderNumber=${order?.orderNumber}&channelRefNumber=${channelRefNumber}&token=${token}`);
                            }
                        },
                    });
                if (item.routes)
                    item.routes.push({
                        'path': '/status/tara/',
                        'method': 'post',
                        'access': 'customer_all',
                        'controller': async (req, res, next) => {
                            let Order = req.mongoose.model('Order');
                            let {result, desc, token, channelRefNumber, additionalData, orderId, orderNumber, pan} = req.body;
                            const getOrderFromDB = async () => {
                                return new Promise((resolve, reject) => {
                                    Order.findById(orderId, (err, order) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(order);
                                        }
                                    });
                                });
                            };
                            const order = await getOrderFromDB()
                            res.json({success: true, orderNumber: order?.orderNumber})
                        },
                    });
            }

        });
    props['plugin']['tara-gateway'] = [
        {name: 'accessToken', value: '', label: 'accessToken'},
        {name: 'expireTime', value: '', label: 'expireTime'},
    ];
    return props;
}
