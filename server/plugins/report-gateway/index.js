let json = {};
export {json};

function getActiveUser(req, res, next) {
    // console.log("==> getActiveUser()")
    let Customer = req.mongoose.model('Customer');
    let Order = req.mongoose.model('Order');
    const appointment = new Date();
    appointment.setDate(appointment.getDate() + 15);
    let search = {
        "data.expireDate": {$gte: appointment}
    };
    // console.log("search", search)
    Customer.countDocuments(search, async function (err, count) {
        if (err || !count) {


        }
        try {
            const count2 = await Customer.find(search).count().exec()
            res.json({count: count, count2: count2, date: appointment})
        } catch (e) {

        }
    })
}

function getCountOfOnceBought(req, res, next) {
    // console.log("==> getCountOfOnceBought()")
    let Customer = req.mongoose.model('Customer');
    let Order = req.mongoose.model('Order');
    const appointment = new Date();
    appointment.setDate(appointment.getDate() + 15);
    let search = {
        // "data.expireDate": {$gte: appointment}
        "paymentStatus": "paid",
        "status": "complete"
    };
    // console.log("search", search)

    function get_customer_index(_id, arr) {
        _id=_id.toString()
        // console.log("if_customer_exist:", _id)
        let index = null;
        let sc = false;
        let ind = 0
        for (let i = 0; i <= arr.length; i++) {
            if (arr[i] && (arr[i].customer == _id)) {
                // console.log("customer is in:",i)
                index = i;
                sc = true;
                ind++;
            } else {
                ind++
            }
            if (arr.length == ind)
                return {
                    index: index,
                    success: sc
                }
        }


    }

    let arr = []
    let count = 0;
    let ti = 0;
    Order.find(search, async function (err, order) {
        // console.log("order.length no order", order.length)
        // console.log("(err || !order)",(err || !order))

        if (err || !order) {
            // console.log("no order")
            return res.json({count: 0, data: []})


        }
        if (!order?.length) {
            // console.log("no order")
            return res.json({count: 0, data: []})
        }
        for (let i = 0; i <= order?.length; i++) {
            if (order[i] && order[i].customer) {
                if (arr.length == 0) {
                    ti++;
                    arr = [{customer: order[i].customer.toString(), order_count: 1}]
                } else {
                    let j = get_customer_index(order[i].customer.toString(), arr);
                    // console.log("j", j)
                    if (j?.success && j?.index) {
                        arr[j.index].order_count = arr[j.index].order_count + 1;
                    } else if (j && !j.success) {
                        arr.push({customer: order[i].customer.toString(), order_count: 1})
                    }
                    ti++;
                }
                console.log("ti",ti,"order.length",order.length)
                if (ti == order.length) {
                    let ps=[];
                    let ifd=0;
                    for(let g=0;g<=arr?.length;g++){
                        if(arr[g] && (arr[g].order_count==1)) {
                            ps.push(arr[g]);
                            ifd++;
                        }else{
                            ifd++;
                        }
                        console.log("ifd",ifd,"==arr.length",arr.length)

                        if(ifd==arr.length){
                            console.log("ifd==arr.length")
                            res.json({count: ps.length, data: ps})

                        }
                    }

                }
            }else{
                ti++;
            }
        }
        // try {
        //     const count2 = await Customer.find(search).count().exec()
        // res.json({count: arr.length,arr:arr})
        // } catch (e) {
        //
        // }
    });
}

function getCountOfMoreThanOnceBought(req, res, next) {
    // console.log("==> getCountOfMoreThanOnceBought()")
    let Customer = req.mongoose.model('Customer');
    let Order = req.mongoose.model('Order');
    const appointment = new Date();
    appointment.setDate(appointment.getDate() + 15);
    let search = {
        // "data.expireDate": {$gte: appointment}
        "paymentStatus": "paid",
        "status": "complete"
    };

    function get_customer_index(_id, arr) {
        _id=_id.toString()
        // console.log("if_customer_exist:", _id)
        let index = null;
        let sc = false;
        let ind = 0
        for (let i = 0; i <= arr.length; i++) {
            if (arr[i] && (arr[i].customer == _id)) {
                // console.log("customer is in:",i)
                index = i;
                sc = true;
                ind++;
            } else {
                ind++
            }
            if (arr.length == ind)
                return {
                    index: index,
                    success: sc
                }
        }


    }

    let arr = []
    let count = 0;
    // console.log("search", search)

    Order.find(search, async function (err, order) {
        // console.log("order.length", order.length)
        if (err || !order) {


        }
        if (!order?.length) {
            // console.log("no order")
            return res.json({count: 0, data: []})
        }
        let ti = 0;

        for (let i = 0; i <= order?.length; i++) {
            if (order[i] && order[i].customer) {
                if (arr.length == 0) {
                    ti++;
                    arr = [{customer: order[i].customer.toString(), order_count: 1}]
                } else {
                    let j = get_customer_index(order[i].customer.toString(), arr);
                    // console.log("j", j)
                    if (j?.success && j?.index) {
                        arr[j.index].order_count = arr[j.index].order_count + 1;
                    } else if (j && !j.success) {
                        arr.push({customer: order[i].customer.toString(), order_count: 1})
                    }
                    ti++;
                }
                // console.log("ti",ti,"i",i,"order.length",order.length)
                if (ti == order.length) {
                    let ps=[];
                    let ifd=0;
                    for(let g=0;g<=arr?.length;g++){
                        if(arr[g] && (arr[g].order_count==1)) {
                            ps.push(arr[g]);
                            ifd++;
                        }else{
                            ifd++;
                        }
                        // console.log("ifd",ifd,"arr.length",arr.length)
                        if(ifd==arr.length){
                            res.json({count: (arr.length - ps.length),arr,ps})

                        }
                    }

                }
            }else{
                ti++;
            }
        }
        // try {
        //     const count2 = await Customer.find(search).count().exec()
        // res.json({count: arr.length,arr:arr})
        // } catch (e) {
        //
        // }
    });
}
function getCountOfNeverBought(req, res, next) {
    // console.log("==> getCountOfNeverBought()")
    let Customer = req.mongoose.model('Customer');
    let Order = req.mongoose.model('Order');
    const appointment = new Date();
    appointment.setDate(appointment.getDate() + 15);
    let search = {
        // "data.expireDate": {$gte: appointment}
        "paymentStatus": "paid",
        "status": "complete"
    };
    // console.log("search", search)

    function get_customer_index(_id, arr) {
        _id=_id.toString()
        // console.log("if_customer_exist:", _id)
        let index = null;
        let sc = false;
        let ind = 0
        for (let i = 0; i <= arr.length; i++) {
            if (arr[i] && (arr[i].customer == _id)) {
                // console.log("customer is in:",i)
                index = i;
                sc = true;
                ind++;
            } else {
                ind++
            }
            if (arr.length == ind)
                return {
                    index: index,
                    success: sc
                }
        }


    }

    let arr = []
    let count = 0;
    let ti = 0;
    Customer.countDocuments({source:"WEBSITE"}, async function (err, cus_count) {
        Order.find(search, async function (err, order) {
            // console.log("order.length", order.length)
            if (err || !order) {


            }
            if (!order?.length) {
                // console.log("no order")
                return res.json({count: 0, data: []})
            }
            for (let i = 0; i <= order?.length; i++) {
                if (order[i] && order[i].customer) {
                    if (arr.length == 0) {
                        ti++;
                        arr = [{customer: order[i].customer.toString(), order_count: 1}]
                    } else {
                        let j = get_customer_index(order[i].customer.toString(), arr);
                        // console.log("j", j)
                        if (j?.success && j?.index) {
                            arr[j.index].order_count = arr[j.index].order_count + 1;
                        } else if (j && !j.success) {
                            arr.push({customer: order[i].customer.toString(), order_count: 1})
                        }
                        ti++;
                    }
                    if (ti == order.length) {
                        res.json({count: (cus_count - arr.length),cus_count:cus_count,order_count:arr.length})


                    }
                }else{
                    ti++;
                }
            }
            // try {
            //     const count2 = await Customer.find(search).count().exec()
            // res.json({count: arr.length,arr:arr})
            // } catch (e) {
            //
            // }
        });
    });
}



export default function GomrokGateway(props) {
    if (props && props.entity)
        props.entity.forEach((item, i) => {
            if (item.name !== "settings") return;

            if (item.routes) {
                item.routes.push({
                    path: "/report/get-active-user",
                    method: "get",
                    access: "admin_user,admin_shopManager",
                    controller: getActiveUser,
                });
                item.routes.push({
                    path: "/get-count-of-once-bought",
                    method: "get",
                    access: "admin_user,admin_shopManager",
                    controller: getCountOfOnceBought,
                });
                item.routes.push({
                    path: "/get-count-of-more-than-once-bought",
                    method: "get",
                    access: "admin_user,admin_shopManager",
                    controller: getCountOfMoreThanOnceBought,
                });
                item.routes.push({
                    path: "/get-count-of-never-bought",
                    method: "get",
                    access: "admin_user,admin_shopManager",
                    controller: getCountOfNeverBought,
                });
                // item.routes.push({
                //   path: "/get-tsc-form",
                //   method: "post",
                //   access: "customer_all",
                //   controller: getTscForm,
                // });
            }
        });
    return props;
}
