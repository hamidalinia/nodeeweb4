import fs, {readFileSync} from "fs";
import * as XLSX from 'xlsx';
import _forEach from 'lodash/forEach.js';
import path from "path"
import mongoose from "mongoose";

const {read, utils} = XLSX;
let json = {};
export {json};

function getTimeDifference(a, b) {
    return Math.abs(b - a) / 36e5;
}

// const JsonFilePath = "./public_media/customer/rates.json";
// const TextFilePath = "./public_media/customer/text.txt";

const Logger = (type = "log", ...arg) =>
    console[type]("[PLG-CRM]: ", ...arg);

async function RegisterCustomer(customer) {
    console.log('tapar', customer)
    console.log('email', customer.email)
    // console.log('customerGroup',  customer.customerGroup)
    let Customer = mongoose.model("Customer");
    Customer.findOne({email: customer?.email}, function (err, response) {
        if (err) {
        }
        if (response) {
            console.log('user ' + customer?.email + ' was in db before...');
            updateActivationCode(customer);

        } else {
            return
            console.log('user ' + customer?.email + ' was not in db before...');

            //we should create customer
            // console.log('customer',customer);
            Customer.create(customer,
                function (err, response) {
                    if (err) {
                        if (parseInt(err.code) == 11000) {
                            Customer.findOne(
                                {email: customer?.email},
                                function (err3, response) {
                                    if (err3) {
                                        // res.json({
                                        //     success: false,
                                        //     message: 'error!',
                                        //     err: err,
                                        // });
                                    }
                                    // console.log('registering user...')
                                    updateActivationCode(customer);
                                }
                            );
                        } else {
                            // res.json({
                            //     success: false,
                            //     message: 'error!',
                            //     err: err,
                            // });
                        }
                    } else {
                        // console.log('==> sending sms');
                        // let $text;
                        // $text = 'Arvand' + '\n' + 'customer registered!' + '\n' + NUMBER;
                        // console.log($text);
                        // if (req.body.invitation_code) {
                        //     self.addToInvitaitionList(response._id, req.body.invitation_code);
                        // }

                        // global.sendSms('9120539945', $text, '300088103373', null, '98').then(function (uid) {
                        //     // console.log('==> sending sms to admin ...');
                        //     let objd = {};
                        //     objd.message = $text;
                        //     global.notifateToTelegram(objd).then(function (f) {
                        //         // console.log('f', f);
                        //     });
                        // }).catch(function () {
                        //     return res.json({
                        //         success: true,
                        //         message: 'Sth wrong happened!'
                        //     });
                        // });
                        updateActivationCode(customer);
                    }
                }
            );
        }
    });

}

function updateActivationCode(customer) {
    let Customer = mongoose.model("Customer");

    console.log('companyName', customer?.companyName)
    Customer.findOneAndUpdate({email: customer?.email}, {$set: {"companyName": customer.companyName}},
        function (err, response) {
            if (err) {
                console.log('error', err);
            } else {
                console.log("done updating")
            }
        }
    );
}

function RegisterItem(it, j) {
    let {tariff, title, number, dolar, arzesh, brand, date} = it[j];

    let Item = mongoose.model("Item");

    console.log('title', title)
    let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var token = "";
    for (let i = 0; i < 10; i++) {
        token += abc[Math.floor(Math.random() * abc.length)];
    }
    // let p_number = arzesh?.toString();
    // if (p_number && p_number != "" && arzesh) {
    //     p_number = p_number.replace(/\s/g, '');
    //     p_number = persianJs(p_number)?.arabicNumber().toString().trim();
    //     p_number = persianJs(p_number)?.persianNumber().toString().trim();
    // }
    Item.create({
            "title": {
                "fa": title
            },
            "slug": token,
            "data": {
                "arzesh": arzesh ? arzesh : "",
                "dolar": dolar ? dolar : "",
                "number": number ? number : "",
                "brand": brand ? brand : "",
                "tariff": tariff ? tariff : "",
                "date": date ? date : ""
            }

        },
        function (err, response) {

            if (err) {
                console.log('error', err);
            } else {
                console.log("done updating")
            }
            j++;
            RegisterItem(it, j);
        }
    );
}

function RegisterInItem(it, j) {
    let {title, number, duty, mojavez, detail, spec_title, spec_title_number} = it[j];

    let Initem = mongoose.model("Initem");
    let Title = mongoose.model("title");

    console.log('title', title)
    let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var token = "";
    for (let i = 0; i < 10; i++) {
        token += abc[Math.floor(Math.random() * abc.length)];
    }
    // let p_number = arzesh?.toString();
    // if (p_number && p_number != "" && arzesh) {
    //     p_number = p_number.replace(/\s/g, '');
    //     p_number = persianJs(p_number)?.arabicNumber().toString().trim();
    //     p_number = persianJs(p_number)?.persianNumber().toString().trim();
    // }
    let obj = {
        "title": {
            "fa": title
        },
        "slug": token,
        "sku": number ? number : "",
        "data": {
            "importduty": duty ? duty : "",
            // "dolar": dolar ? dolar : "",
            "number": number ? number : "",
            "mojavez": mojavez ? mojavez : "",
            "detail": detail ? detail : "",

        }

    }
    if (spec_title) {
        if (!obj['data']['spec_title']) {
            obj['data']['spec_title'] = {}
        }
        obj['data']['spec_title']['title'] = spec_title ? spec_title : ""
    }
    if (spec_title_number) {
        if (!obj['data']['spec_title']) {
            obj['data']['spec_title'] = {}
        }
        obj['data']['spec_title']['number'] = spec_title_number ? spec_title_number : ""
    }
    if (detail) {
        if (!obj['data']['spec_title']) {
            obj['data']['spec_title'] = {}
        }
        obj['data']['spec_title']['details'] = detail ? detail : ""
    }
    // console.log("obj", obj);
    // return
    Initem.create(obj,
        function (err, response) {

            if (err && !response) {
                console.log('error', err);
            } else {
                console.log("done updating")
            }
            j++;
            RegisterInItem(it, j);
        }
    );
}

function RegisterInItemN(it, j) {
    let {number} = it[j];
    console.log("RegisterInItemN", number)

    let Initem = mongoose.model("Initem");

    let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var token = "";
    for (let i = 0; i < 10; i++) {
        token += abc[Math.floor(Math.random() * abc.length)];
    }
    // let p_number = arzesh?.toString();
    // if (p_number && p_number != "" && arzesh) {
    //     p_number = p_number.replace(/\s/g, '');
    //     p_number = persianJs(p_number)?.arabicNumber().toString().trim();
    //     p_number = persianJs(p_number)?.persianNumber().toString().trim();
    // }
    let obj = {
        "sku": number ? number : "",


    }

    console.log("obj?.sku", obj?.sku);
    // return
    Initem.findOne({
            sku: obj?.sku
        }, function (err, init) {
            if (err && !init) {
                console.log('error', err);
                j++;
                RegisterInItemN(it, j);
            } else {
                let d = init?.data;
                if (!d)
                    d = {}
                d['ninteen'] = true
                console.log("data", d)
                if (init?._id)
                    Initem.findByIdAndUpdate(init?._id, {
                            $set: {
                                data: d
                            }
                        }, function (err2, response) {

                            if (err && !response) {
                                console.log('error', err);
                            } else {
                                console.log("done updating")
                            }
                            j++;
                            RegisterInItemN(it, j);
                        }
                    );
                else {
                    j++;
                    RegisterInItemN(it, j);
                }
            }

        }
    );
}

export default function ExporterGateway(props) {
    // console.log("ExporterGateway",props);

    if (props && props.entity)
        props.entity.forEach((item, i) => {
            if (item.name == "customer") {
                if (item.routes) {
                    item.routes.push({
                        path: "/export-excel/:offset/:limit",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            console.log('hi');
                            let Customer = req.mongoose.model('Customer');
                            if (req.headers.response !== 'json') return res.show();

                            let sort = {in_stock: -1, updatedAt: -1};

                            let offset = 0;
                            if (req.params.offset) {
                                offset = parseInt(req.params.offset);
                            }
                            let fields = '';
                            if (req.headers && req.headers.fields) {
                                fields = req.headers.fields;
                            }

                            let searchParams = null;
                            let search = {
                                sku: {
                                    $ne: '',
                                },
                            };

                            if (req.query.filter) {
                                let thef = '';

                                const json = isStringified(req.query.filter);

                                if (typeof json == 'object') {
                                    thef = JSON.parse(req.query.filter);
                                    if (thef.search) searchParams = thef.search;
                                } else {
                                    console.log('string is not a valid json');
                                }
                            }
                            if (req.params.search) searchParams = req.params.search;
                            if (req.query.search) searchParams = req.query.search;
                            if (req.query.Search) searchParams = req.query.Search;

                            if (searchParams) {
                                search['$or'] = [
                                    {
                                        ['title.' + req.headers.lan]: {
                                            $exists: true,
                                            $regex: searchParams,
                                            $options: 'i',
                                        },
                                    },
                                    {
                                        sku: {
                                            $exists: true,
                                            $regex: searchParams,
                                            $options: 'i',
                                        },
                                    },
                                ];
                            }

                            if (req.query && req.query.status) {
                                search.status = req.query.status;
                            }

                            let tt = Object.keys(req.query);

                            _forEach(tt, (item) => {
                                if (Customer.schema.paths[item]) {
                                    let split = req.query[item].split(',');
                                    if (req.mongoose.isValidObjectId(split[0])) {
                                        search[item] = {
                                            $in: split,
                                        };
                                    }
                                } else {
                                    // console.log("filter doesnot exist => ", item);
                                }
                            });
                            let q;
                            console.log('we are herewe are here')
                            if (search['productCategory.slug']) {
                                let ProductCategory = req.mongoose.model('ProductCategory');

                                // console.log('search[\'productCategory.slug\']', search['productCategory.slug'])

                                ProductCategory.findOne(
                                    {slug: search['productCategory.slug']},
                                    function (err, productcategory) {
                                        // console.log('err', err)
                                        // console.log('req', productcategory)
                                        if (err || !productcategory) return res.json([]);
                                        if (productcategory._id) {
                                            // console.log({productCategory: {
                                            //         $in:[productcategory._id]
                                            //     }})
                                            let ss = {productCategory: productcategory._id};
                                            if (thef.device) {
                                                ss['attributes.values'] = thef.device;
                                            }
                                            if (thef.brand) {
                                                ss['attributes.values'] = thef.brand;
                                            }
                                            Customer.find(ss, function (err, products) {
                                                Customer.countDocuments(ss, async function (err, count) {
                                                    if (err || !count) {
                                                        res.json([]);
                                                        return 0;
                                                    }
                                                    res.setHeader('X-Total-Count', count);

                                                    // populate
                                                    // await populateTitle(req.mongoose.model('title'), products);

                                                    return res.json(products);
                                                });
                                            })
                                                .populate('productCategory', '_id slug')
                                                .skip(offset)
                                                .sort(sort)
                                                .limit(parseInt(req.params.limit));
                                        }
                                    }
                                );
                                // console.log('q', q)
                            } else {
                                console.log('we are here')
                                q = Customer.find(search, fields)
                                    .skip(offset)
                                    .sort(sort)
                                    .limit(parseInt(req.params.limit));

                                q.exec(function (err, model) {
                                    if (err || !model) return res.json([]);
                                    Customer.countDocuments(search, async function (err, count) {
                                        if (err || !count) {
                                            res.json([]);
                                            return 0;
                                        }
                                        // populate
                                        // await populateTitle(req.mongoose.model('title'), model);

                                        res.setHeader('X-Total-Count', count);


                                        // const url = "https://docs.sheetjs.com/executive.json";
                                        const raw_data = model;


                                        /* flatten objects */
                                        console.log('raw_data', raw_data)
                                        const rows = raw_data.map(row => ({
                                            _id: row?._id,
                                            email: row?.email,
                                            companyName: row?.companyName,

                                        }));

                                        /* generate worksheet and workbook */
                                        const worksheet = XLSX.utils.json_to_sheet(rows);
                                        const workbook = XLSX.utils.book_new();
                                        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

                                        /* fix headers */
                                        XLSX.utils.sheet_add_aoa(worksheet, [["_id", "email", "companyName"]], {origin: "A1"});

                                        /* calculate column width */
                                        const max_width = rows.reduce((w, r) => Math.max(w, r.companyName), 10);
                                        worksheet["!cols"] = [{wch: max_width}];

                                        /* create an XLSX file and try to save to Presidents.xlsx */
                                        let name = "customers-" + new Date().valueOf() + ".xlsx";
                                        let x = XLSX.writeFile(workbook, "./public_media/exports/" + name, {compression: true});
                                        console.log('x', x)
                                        // return x;
                                        res.json({"url": "https://crm.idehweb.ir/exports/" + name})
                                    });
                                });
                            }
                            // res.json({
                            //     'success':true
                            // })
                        },
                    });
                    item.routes.push({
                        path: "/convert-excel/:offset/:limit",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            console.log('hi');
                            let Customer = req.mongoose.model('Customer');
                            if (req.headers.response !== 'json') return res.show();


                            // const url = "https://docs.sheetjs.com/executive.json";
                            const raw_data = req.body;


                            /* flatten objects */
                            console.log('raw_data', raw_data)
                            const rows = raw_data.map(row => ({
                                _id: row?._id,
                                email: row?.email,
                                companyName: row?.companyName,

                            }));

                            /* generate worksheet and workbook */
                            const worksheet = XLSX.utils.json_to_sheet(rows);
                            const workbook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

                            /* fix headers */
                            XLSX.utils.sheet_add_aoa(worksheet, [["_id", "email", "companyName"]], {origin: "A1"});

                            /* calculate column width */
                            const max_width = rows.reduce((w, r) => Math.max(w, r.companyName), 10);
                            worksheet["!cols"] = [{wch: max_width}];

                            /* create an XLSX file and try to save to Presidents.xlsx */
                            let name = "customers-" + new Date().valueOf() + ".xlsx";
                            let x = XLSX.writeFile(workbook, "./public_media/exports/" + name, {compression: true});
                            console.log('x', x)
                            // return x;
                            res.json({"url": "https://crm.idehweb.ir/exports/" + name})

                            // res.json({
                            //     'success':true
                            // })
                        },
                    });
                    item.routes.push({
                        path: "/import-excel/",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            console.log('hi');
                            let Customer = req.mongoose.model('Customer');
                            // if (req.headers.response !== 'json') return res.show();
                            if (req.busboy) {
                                req.pipe(req.busboy);

                                req.busboy.on("file", function (
                                    fieldname,
                                    file,
                                    filename,
                                    encoding,
                                    mimetype
                                ) {
                                    let fstream;
                                    const __dirname = path.resolve();

                                    console.log("global.getFormattedTime() + filename", req.global.getFormattedTime(), filename["filename"]);
                                    let name = (req.global.getFormattedTime() + filename.filename).replace(/\s/g, "");
                                    let Media = req.mongoose.model('Media');

                                    let filePath = path.join(__dirname, "./public_media/customer/", name);
                                    console.log("on file app filePath", filePath);

                                    fstream = fs.createWriteStream(filePath);
                                    console.log('on file app mimetype', typeof filename.mimeType);

                                    file.pipe(fstream);
                                    fstream.on("close", function () {
                                        console.log('Files saved');
                                        let url = "customer/" + name;
                                        let obj = [{name: name, url: url, type: mimetype}];
                                        req.photo_all = obj;
                                        let photos = obj;
                                        if (photos && photos[0]) {
                                            Media.create({
                                                name: photos[0].name,
                                                url: photos[0].url,
                                                type: photos[0].type

                                            }, async function (err, media) {


                                                if (err && !media) {


                                                    res.json({
                                                        err: err,
                                                        success: false,
                                                        message: "error"
                                                    });

                                                }
                                                console.log('filePath', filePath)
                                                try {
                                                    // const workbook = await read(filePath, { type: 'binary' });
                                                    const buf = readFileSync(filePath);
                                                    /* buf is a Buffer */
                                                    const workbook = read(buf);
                                                    const sheetName = await workbook.SheetNames[0];
                                                    const sheet = await workbook.Sheets[sheetName];
                                                    const jsonData = await utils.sheet_to_json(sheet);
                                                    for (let ii = 0; ii < jsonData?.length; ii++) {
                                                        // console.log(jsonData[ii]?.email,jsonData[ii]?.companyName)
                                                        let tr = await RegisterCustomer(jsonData[ii]);

                                                    }
                                                    await res.json([]);
                                                    // await res.send(jsonData)
                                                } catch (error) {
                                                    console.error(error);
                                                    res.status(500).json({error: 'Failed to process the uploaded file'});
                                                }

                                            });
                                        } else {
                                            res.json({
                                                success: false,
                                                message: "upload faild!"
                                            });
                                        }
                                    });
                                });
                            } else {
                                next();
                            }
                        }
                    });
                }
            }
            if (item.name == "item") {
                if (item.routes) {
                    item.routes.push({
                        path: "/import-excel",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            console.log('import-excel');
                            let Item = req.mongoose.model('Item');
                            if (req.busboy) {
                                req.pipe(req.busboy);

                                req.busboy.on("file", function (
                                    fieldname,
                                    file,
                                    filename,
                                    encoding,
                                    mimetype
                                ) {
                                    let fstream;
                                    const __dirname = path.resolve();

                                    console.log("global.getFormattedTime() + filename", req.global.getFormattedTime(), filename["filename"]);
                                    let name = (req.global.getFormattedTime() + filename.filename).replace(/\s/g, "");
                                    let Media = req.mongoose.model('Media');

                                    let filePath = path.join(__dirname, "./public_media/customer/", name);
                                    console.log("on file app filePath", filePath);

                                    fstream = fs.createWriteStream(filePath);
                                    console.log('on file app mimetype', typeof filename.mimeType);

                                    file.pipe(fstream);
                                    fstream.on("close", function () {
                                        console.log('Files saved');
                                        let url = "customer/" + name;
                                        let obj = [{name: name, url: url, type: mimetype}];
                                        req.photo_all = obj;
                                        let photos = obj;
                                        if (photos && photos[0]) {
                                            Media.create({
                                                name: photos[0].name,
                                                url: photos[0].url,
                                                type: photos[0].type

                                            }, async function (err, media) {


                                                if (err && !media) {


                                                    res.json({
                                                        err: err,
                                                        success: false,
                                                        message: "error"
                                                    });

                                                }
                                                console.log('filePath', filePath)
                                                try {
                                                    // const workbook = await read(filePath, { type: 'binary' });
                                                    const buf = readFileSync(filePath);
                                                    /* buf is a Buffer */
                                                    const workbook = read(buf);
                                                    const sheetName = await workbook.SheetNames[0];
                                                    const sheet = await workbook.Sheets[sheetName];
                                                    const jsonData = await utils.sheet_to_json(sheet, {
                                                        raw: false,
                                                        defval: ''
                                                    });
                                                    // for (let ii = 0; ii < jsonData?.length; ii++) {
                                                    // console.log(jsonData[ii])
                                                    let j = 0;
                                                    // while(j < jsonData?.length){
                                                    //     console.log("RegisterItem", Object.keys(jsonData[j]))
                                                    let tr = RegisterItem(jsonData, j);
                                                    // let {tariff, title, number, dolar, arzesh, brand} = jsonData[j];

                                                    // let Item = req.mongoose.model("Item");

//                                                         console.log('title', title)
//                                                         let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
//                                                         var token = "";
//                                                         for (let i = 0; i < 10; i++) {
//                                                             token += abc[Math.floor(Math.random() * abc.length)];
//                                                         }
//                                                         let obj={
//                                                             "title": {
//                                                                 "fa": title ? title : ""
//                                                             },
//                                                             "slug": token ? token : "",
//                                                             "data": {
//                                                                 "arzesh": arzesh ? arzesh : "",
//                                                                 "dolar": dolar ? dolar : "",
//                                                                 "number": number ? number : "",
//                                                                  "brand": brand ? brand : "",
//                                                                 "tariff": tariff ? tariff : ""
//                                                             }
//
//                                                         };
// console.log("obj",obj)
//                                                         Item.create(obj,
//                                                             function (err, response) {
//                                                                 j++;
//                                                                 if (err) {
//                                                                     console.log('error', err);
//                                                                 } else {
//                                                                     console.log("done updating")
//                                                                 }
//                                                             }
//                                                         );
//                                                     }
                                                    await res.json([]);
                                                    // await res.send(jsonData)
                                                } catch (error) {
                                                    console.error(error);
                                                    res.status(500).json({error: 'Failed to process the uploaded file'});
                                                }

                                            });
                                        } else {
                                            res.json({
                                                success: false,
                                                message: "upload faild!"
                                            });
                                        }
                                    });
                                });
                            } else {
                                next();
                            }
                        },
                    });

                }
            }
            if (item.name == "initem") {
                if (item.routes) {
                    item.routes.push({
                        path: "/export-excel/:offset/:limit",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            console.log('hi');
                            let Initem = req.mongoose.model('Initem');
                            if (req.headers.response !== 'json') return res.show();

                            let sort = {in_stock: -1, updatedAt: -1};

                            let offset = 0;
                            if (req.params.offset) {
                                offset = parseInt(req.params.offset);
                            }
                            let fields = '';
                            if (req.headers && req.headers.fields) {
                                fields = req.headers.fields;
                            }

                            let searchParams = null;
                            let search = {
                                sku: {
                                    $ne: '',
                                },
                            };

                            let q;
                            q = Initem.find({})
                                .skip(offset)
                                .sort(sort)
                                .limit(parseInt(req.params.limit));

                            q.exec(function (err, model) {
                                if (err || !model) return res.json([]);


                                // const url = "https://docs.sheetjs.com/executive.json";
                                const raw_data = model;


                                /* flatten objects */
                                // console.log('raw_data', raw_data)
                                const rows = raw_data.map(row => {
                                    if (row) {
                                        // console.log("row?.data?.importduty", row?.data?.importduty)
                                        return ({
                                            "_id": row?._id,
                                            "title": row?.title?.fa,
                                            "slug": row?.slug,
                                            "number": row?.data?.number?.toString(),
                                            "mojavez": row?.data?.mojavez,
                                            "group1": row?.data?.group1,
                                            "emkan": row?.data?.emkan,
                                            "importduty": row?.data?.importduty?.toString()

                                        })
                                    }
                                });

                                /* generate worksheet and workbook */
                                const worksheet = XLSX.utils.json_to_sheet(rows);
                                const workbook = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

                                /* fix headers */
                                XLSX.utils.sheet_add_aoa(worksheet, [["_id", "title", "sku", "slug", "", "number", "mojavez", "group1", "importduty", "emkan", ""]], {origin: "A1"});

                                /* calculate column width */
                                const max_width = rows.reduce((w, r) => Math.max(w, r?.title?.fa), 10);
                                worksheet["!cols"] = [{wch: max_width}];

                                /* create an XLSX file and try to save to Presidents.xlsx */
                                let name = "customers-" + new Date().valueOf() + ".xlsx";
                                let x = XLSX.writeFile(workbook, "./public_media/exports/" + name, {compression: true});
                                console.log('x', x)
                                // return x;
                                res.json({"url": "https://gomrok24.com/exports/" + name})
                            });


                            // res.json({
                            //     'success':true
                            // })
                        },
                    });
                    item.routes.push({
                        path: "/import-excel/",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            console.log('import-excel');
                            let Item = req.mongoose.model('Item');
                            if (req.busboy) {
                                req.pipe(req.busboy);

                                req.busboy.on("file", function (
                                    fieldname,
                                    file,
                                    filename,
                                    encoding,
                                    mimetype
                                ) {
                                    let fstream;
                                    const __dirname = path.resolve();

                                    console.log("global.getFormattedTime() + filename", req.global.getFormattedTime(), filename["filename"]);
                                    let name = (req.global.getFormattedTime() + filename.filename).replace(/\s/g, "");
                                    let Media = req.mongoose.model('Media');

                                    let filePath = path.join(__dirname, "./public_media/customer/", name);
                                    console.log("on file app filePath", filePath);

                                    fstream = fs.createWriteStream(filePath);
                                    console.log('on file app mimetype', typeof filename.mimeType);

                                    file.pipe(fstream);
                                    fstream.on("close", function () {
                                        console.log('Files saved');
                                        let url = "customer/" + name;
                                        let obj = [{name: name, url: url, type: mimetype}];
                                        req.photo_all = obj;
                                        let photos = obj;
                                        if (photos && photos[0]) {
                                            Media.create({
                                                name: photos[0].name,
                                                url: photos[0].url,
                                                type: photos[0].type

                                            }, async function (err, media) {


                                                if (err && !media) {


                                                    res.json({
                                                        err: err,
                                                        success: false,
                                                        message: "error"
                                                    });

                                                }
                                                console.log('filePath', filePath)
                                                try {
                                                    // const workbook = await read(filePath, { type: 'binary' });
                                                    const buf = readFileSync(filePath);
                                                    /* buf is a Buffer */
                                                    const workbook = read(buf);
                                                    const sName = await workbook.SheetNames[0];
                                                    const she = await workbook.Sheets[sName];
                                                    // console.log("sheet",sheet)
                                                    const jsonData = await utils.sheet_to_json(she, {
                                                        raw: false,
                                                        defval: ''
                                                    });
                                                    // for (let ii = 0; ii < jsonData?.length; ii++) {
                                                    // console.log(jsonData[ii])
                                                    let j = 0;
                                                    // while(j < jsonData?.length){
                                                    // console.log("RegisterItem", (jsonData[j]))
                                                    let tr = RegisterInItem(jsonData, j);
                                                    // let {tariff, title, number, dolar, Œarzesh, brand} = jsonData[j];

                                                    // let Item = req.mongoose.model("Item");

//                                                         console.log('title', title)
//                                                         let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
//                                                         var token = "";
//                                                         for (let i = 0; i < 10; i++) {
//                                                             token += abc[Math.floor(Math.random() * abc.length)];
//                                                         }
//                                                         let obj={
//                                                             "title": {
//                                                                 "fa": title ? title : ""
//                                                             },
//                                                             "slug": token ? token : "",
//                                                             "data": {
//                                                                 "arzesh": arzesh ? arzesh : "",
//                                                                 "dolar": dolar ? dolar : "",
//                                                                 "number": number ? number : "",
//                                                                  "brand": brand ? brand : "",
//                                                                 "tariff": tariff ? tariff : ""
//                                                             }
//
//                                                         };
// console.log("obj",obj)
//                                                         Item.create(obj,
//                                                             function (err, response) {
//                                                                 j++;
//                                                                 if (err) {
//                                                                     console.log('error', err);
//                                                                 } else {
//                                                                     console.log("done updating")
//                                                                 }
//                                                             }
//                                                         );
//                                                     }
                                                    await res.json([]);
                                                    // await res.send(jsonData)
                                                } catch (error) {
                                                    console.error(error);
                                                    res.status(500).json({error: 'Failed to process the uploaded file'});
                                                }

                                            });
                                        } else {
                                            res.json({
                                                success: false,
                                                message: "upload faild!"
                                            });
                                        }
                                    });
                                });
                            } else {
                                next();
                            }
                        },

                    });
                    item.routes.push({
                        path: "/import-excel-n/",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            console.log('import-excel-n');
                            let Item = req.mongoose.model('Item');
                            if (req.busboy) {
                                req.pipe(req.busboy);

                                req.busboy.on("file", function (
                                    fieldname,
                                    file,
                                    filename,
                                    encoding,
                                    mimetype
                                ) {
                                    let fstream;
                                    const __dirname = path.resolve();

                                    console.log("global.getFormattedTime() + filename", req.global.getFormattedTime(), filename["filename"]);
                                    let name = (req.global.getFormattedTime() + filename.filename).replace(/\s/g, "");
                                    let Media = req.mongoose.model('Media');

                                    let filePath = path.join(__dirname, "./public_media/customer/", name);
                                    console.log("on file app filePath", filePath);

                                    fstream = fs.createWriteStream(filePath);
                                    console.log('on file app mimetype', typeof filename.mimeType);

                                    file.pipe(fstream);
                                    fstream.on("close", function () {
                                        console.log('Files saved');
                                        let url = "customer/" + name;
                                        let obj = [{name: name, url: url, type: mimetype}];
                                        req.photo_all = obj;
                                        let photos = obj;
                                        if (photos && photos[0]) {
                                            Media.create({
                                                name: photos[0].name,
                                                url: photos[0].url,
                                                type: photos[0].type

                                            }, async function (err, media) {


                                                if (err && !media) {


                                                    res.json({
                                                        err: err,
                                                        success: false,
                                                        message: "error"
                                                    });

                                                }
                                                console.log('filePath', filePath)
                                                try {
                                                    // const workbook = await read(filePath, { type: 'binary' });
                                                    const buf = readFileSync(filePath);
                                                    /* buf is a Buffer */
                                                    const workbook = read(buf);
                                                    const sName = await workbook.SheetNames[0];
                                                    const she = await workbook.Sheets[sName];
                                                    // console.log("sheet",sheet)
                                                    const jsonData = await utils.sheet_to_json(she, {
                                                        raw: false,
                                                        defval: ''
                                                    });
                                                    // for (let ii = 0; ii < jsonData?.length; ii++) {
                                                    // console.log(jsonData[ii])
                                                    let j = 0;
                                                    // while(j < jsonData?.length){
                                                    // console.log("RegisterItemN", (jsonData[j]))
                                                    let tr = RegisterInItemN(jsonData, j);
                                                    // let {tariff, title, number, dolar, Œarzesh, brand} = jsonData[j];

                                                    // let Item = req.mongoose.model("Item");

//                                                         console.log('title', title)
//                                                         let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
//                                                         var token = "";
//                                                         for (let i = 0; i < 10; i++) {
//                                                             token += abc[Math.floor(Math.random() * abc.length)];
//                                                         }
//                                                         let obj={
//                                                             "title": {
//                                                                 "fa": title ? title : ""
//                                                             },
//                                                             "slug": token ? token : "",
//                                                             "data": {
//                                                                 "arzesh": arzesh ? arzesh : "",
//                                                                 "dolar": dolar ? dolar : "",
//                                                                 "number": number ? number : "",
//                                                                  "brand": brand ? brand : "",
//                                                                 "tariff": tariff ? tariff : ""
//                                                             }
//
//                                                         };
// console.log("obj",obj)
//                                                         Item.create(obj,
//                                                             function (err, response) {
//                                                                 j++;
//                                                                 if (err) {
//                                                                     console.log('error', err);
//                                                                 } else {
//                                                                     console.log("done updating")
//                                                                 }
//                                                             }
//                                                         );
//                                                     }
                                                    await res.json([]);
                                                    // await res.send(jsonData)
                                                } catch (error) {
                                                    console.error(error);
                                                    res.status(500).json({error: 'Failed to process the uploaded file'});
                                                }

                                            });
                                        } else {
                                            res.json({
                                                success: false,
                                                message: "upload faild!"
                                            });
                                        }
                                    });
                                });
                            } else {
                                next();
                            }
                        },

                    });
                }
            }
            // console.log("item", item.routes)

        });

    return props;
}
