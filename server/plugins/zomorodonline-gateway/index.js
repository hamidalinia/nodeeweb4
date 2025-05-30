let json = {}
export {json};


export default (props) => {

    function sendToZomorodonline(req, status, params) {
        console.log("sendToZomorodonline...",params)
        return new Promise(function (resolve, reject) {

            let Settings = req.mongoose.model('Settings');

            Settings.findOne({}, 'plugins currency', function (err, setting) {
                // console.log('setting:',setting)
                if (!setting.plugins) {
                    return reject({})
                }
                if (!setting.plugins['zomorodonline-gateway'])
                    return reject({})

                let {zomorodonlinetoken} = setting.plugins['zomorodonline-gateway'];

                if (!zomorodonlinetoken) {
                    return reject({})
                }
                // if (setting.currency)
                //     params.currency = setting.currency;

                if (zomorodonlinetoken && status == 'create-customer-by-admin') {
                    // onCreateOrderByCustomer = washString(onCreateOrderByCustomer, params);
                    // publishToTelegram(req, telegramLink, telegramChatID, onCreateOrderByCustomer).then(e => console.log('e', e)).catch((d) => console.log('d', d))

                }
                if (zomorodonlinetoken && status == 'get-customer-by-admin') {
                    // onCreateOrderByCustomer = washString(onCreateOrderByCustomer, params);
                    // publishToTelegram(req, telegramLink, telegramChatID, onCreateOrderByCustomer).then(e => console.log('e', e)).catch((d) => console.log('d', d))

                }
                if (zomorodonlinetoken && status == 'create-order-by-admin') {
                    // onCreateOrderByCustomer = washString(onCreateOrderByCustomer, params);
                    // publishToTelegram(req, telegramLink, telegramChatID, onCreateOrderByCustomer).then(e => console.log('e', e)).catch((d) => console.log('d', d))

                }

            })


        });

    }

    if (props && props.entity)
        props.entity.map((item, i) => {
            console.log('item.name', item.name)
            if (item.name === 'gateway') {
                item.routes.push({
                    'path': '/zomorodonline/saveCustomer',
                    'method': 'post',
                    'access': 'admin_user,admin_shopManager',
                    'controller': (req, res, next) => {

                    }
                })
                if (!item.functions) {
                    item.functions = [];
                }
                if (!item.hook) {
                    item.hook = [];
                }


                // item.functions.push({
                //     "name": "send_to_zomorodonline",
                //     "controller": (req, res, next) => {
                //         console.log('send_to_zomorodonline', req.body);
                //         return res.json({
                //             success: true
                //         })
                //
                //
                //     }
                // })

                item.hook.push({
                    event: 'create-order-by-admin',
                    name: 'send order to Zomorodonline',
                    func: (req, res, next, params) => {
                        console.log('create-order-by-admin');
                        sendToZomorodonline(req, 'create-order-by-admin', params).then(e => console.log('e', e)).catch((d) => console.log('d', d))
                    }
                })
                item.hook.push({
                    event: 'create-customer-by-admin',
                    name: 'create customer by admin inside Zomorodonline',
                    func: (req, res, next, params) => {
                        console.log('create-customer-by-admin');
                        sendToZomorodonline(req, 'create-customer-by-admin', params).then(e => console.log('e', e)).catch((d) => console.log('d', d))
                    }
                })
                item.hook.push({
                    event: 'get-customer-by-admin',
                    name: 'get customer by admin in Zomorodonline',
                    func: (req, res, next, params) => {
                        console.log('get-customer-by-admin');
                        sendToZomorodonline(req, 'get-customer-by-admin', params).then(e => console.log('e', e)).catch((d) => console.log('d', d))
                    }
                })



            }
        })
    // console.log('props');
    props['plugin']['zomorodonline-gateway'] = [
        {name: "zomorodonlinetoken", value: '', label: "zomorodonline token"},
    ];
    return props;
}