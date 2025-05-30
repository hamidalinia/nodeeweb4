import fs from "fs";
import * as XLSX from 'xlsx';
import path from "path"
import axios from "axios";
import mongoose from "mongoose";
import {readFile} from 'fs/promises';

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
    // console.log('tapar', customer)
    // console.log('email', customer.email)
    // console.log('customerGroup',  customer.customerGroup)
    let Customer = mongoose.model("Customer");
    Customer.findOne({email: customer?.email}, function (err, response) {
        if (err) {
        }
        if (response) {
            // console.log('user ' + customer?.email + ' was in db before...');
            updateActivationCode(customer);

        } else {
            return
            // console.log('user ' + customer?.email + ' was not in db before...');

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

    // console.log('companyName', customer?.companyName)
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
                // console.log("data", d)
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
                        path: "/export-image/:offset/:limit",
                        method: "get",
                        access: "customer_all",
                        controller: async (req, res, next) => {

                            console.log("hi")
                            let name = "bott.json";
                            const __dirname = path.resolve();

                            let filePath = path.join(__dirname, "./public_media/customer/", name);

                            // const buf = readFileSync(filePath);
                            function decode_base64(base64str, filename) {
// console.log("base64str",base64str)
                                let b = base64str.split("data:image/png;base64,")
                                // console.log("b",b[1]);
                                base64str = b[1]
                                console.log("filename", filename)
                                console.log("")
                                var buf = Buffer.from(base64str, 'base64');
                                let pas = path.join(__dirname, '/public_media/customer/', filename)
                                fs.writeFile(pas, buf, function (error) {
                                    if (error) {
                                        throw error;
                                    } else {
                                        console.log('File created from base64 string!', pas);
                                        return true;
                                    }
                                });

                            }

                            try {
                                const jsonData = await readFile(filePath, 'utf8');
                                // console.log()
                                let tj = JSON.parse(jsonData);
                                tj?.assets.forEach((at, i) => {
                                    // console.log("i", i)
                                    decode_base64(at?.p, i + '.png')
                                    //     decode_base64("", '1' + '.png')
                                })
                                // decode_base64(tj?.assets[0]?.p, i + '.png')

                                res.json(tj?.assets)
                                // resolve(JSON.parse(jsonData))
                            } catch (e) {
                                console.log("Error from import_json(): " + e)
                            }
                        }
                    });
                    item.routes.push({
                        path: "/import-image/:offset/:limit",
                        method: "get",
                        access: "customer_all",
                        controller: async (req, res, next) => {

                            console.log("hi")
                            let name = "bott.json";
                            const __dirname = path.resolve();

                            let filePath = path.join(__dirname, "./public_media/customer/", name);

                            // const buf = readFileSync(filePath);
                            function encode_base64(i) {

                                let filename = '' + String(i).padStart(4, '0') + '.png';
                                // if(i<10){
                                //     filename='00'+i+'.png';
                                // }
// console.log("base64str",base64str)
                                // let b=base64str.split("data:image/png;base64,")
                                // console.log("filename",filename);
                                // return;
                                // base64str=b[1]
                                // console.log("filename", filename)
                                // console.log("")
                                // var buf = Buffer.from(base64str, 'base64');
                                let pas = path.join(__dirname, '/public_media/customer/', filename)
                                const buffer = fs.readFileSync(pas);
                                const base64String = Buffer.from(buffer).toString('base64');
                                return 'data:image/png;base64,' + base64String;


                            }

                            try {
                                const jsonData = await readFile(filePath, 'utf8');
                                // console.log()
                                let tj = JSON.parse(jsonData);
                                // tj?.assets.forEach((at, i) => {
                                for (let i = 0; i <= 140; i++) {
                                    console.log("i", i)
                                    if (i + 1 != 141) {
                                        if (!tj.assets[i]) {
                                            tj.assets[i] = tj.assets[i - 1];
                                        }
                                        tj.assets[i].p = encode_base64(i + 1)
                                    }
                                    // tj.assets[i].w=400;
                                    // tj.assets[i].h=500;
                                    // decode_base64(at?.p, i + '.png')
                                    //     decode_base64("", '1' + '.png')
                                    // })
                                }
                                // decode_base64(tj?.assets[0]?.p, i + '.png')

                                res.json(tj?.assets)
                                let fds = path.join(__dirname, "./public_media/customer/", "xx.json");

                                fs.writeFile(fds, JSON.stringify(tj), function (error) {
                                    if (error) {
                                        throw error;
                                    } else {
                                        console.log('File created from base64 string!', fds);
                                        return true;
                                    }
                                });
                                // resolve(JSON.parse(jsonData))
                            } catch (e) {
                                console.log("Error from import_json(): " + e)
                            }
                        }
                    });

                }
            }
            if (item.name == "post") {
                if (item.routes) {

                    item.routes.push({
                        path: "/import-post/",
                        method: "post",
                        access: "customer_all",
                        controller: async (req, res, next) => {
                            try {
                                console.log("import-post",req.body)
                                // Get data from the request body
                                const {post_title, post_slug, post_excerpt, post_description, post_image_url} = req.body;
                                const __dirname = path.resolve();

                                let body = {
                                    title: {fa: post_title},
                                    slug: post_slug,
                                    excerpt: {fa: post_excerpt},
                                    description: {fa: post_description},
                                    thumbnail: post_image_url
                                };

                                // console.log("post_image_url", req.body?.post_image_url);
                                // console.log("post_slug", req.body?.post_slug);
                                // console.log("post_title", req.body?.post_title);
                                // console.log("post_excerpt", req.body?.post_excerpt);
                                console.log("req.body", req.body);
                                if (post_image_url)
                                    axios.get(post_image_url)
                                        .then(async (response) => {
                                            const imageUrl = response?.data?.image; // Extract the image URL

                                            console.log("response", response?.data);

                                            if (imageUrl) {
                                                const url = post_image_url;
                                                const extensionmain = url.substring(url.lastIndexOf('.') + 1); // Get everything after the last dot

// Generate a random name based on the current timestamp and a random number
                                                const randomName = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// Combine the random name with the file extension


                                                // Download the image using axios
                                                const imageResponse = await axios({
                                                    method: 'get',
                                                    url: imageUrl,
                                                    responseType: 'arraybuffer',
                                                    headers: {
                                                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                                                        'Accept': 'image/*'
                                                    }
                                                });
                                                console.log("Full Headers:", imageResponse.headers);

                                                // Detect content type to determine the correct extension
                                                const mimetype = imageResponse.headers['content-type']?.toLowerCase();
                                                let extension = '';
                                                if (!mimetype) {
                                                    if (imageUrl.match(/\.(jpeg|jpg)$/i)) extension = 'jpg';
                                                    else if (imageUrl.match(/\.png$/i)) extension = 'png';
                                                    else if (imageUrl.match(/\.webp$/i)) extension = 'webp';
                                                    else if (imageUrl.match(/\.avif$/i)) extension = 'avif';
                                                    else {
                                                        console.error("Unknown image format, cannot determine extension.");
                                                        return res.json({
                                                            success: false,
                                                            message: "Unknown image format"
                                                        });
                                                    }
                                                }
                                                console.log("mimetype", mimetype);
                                                if (mimetype)
                                                    if (mimetype.includes('image/jpeg')) {
                                                        extension = 'jpg';
                                                    } else if (mimetype.includes('image/png')) {
                                                        extension = 'png';
                                                    } else if (mimetype.includes('image/webp')) {
                                                        extension = 'webp';
                                                    } else if (mimetype.includes('image/avif')) {
                                                        extension = 'avif';
                                                    } else {
                                                        console.error('Unsupported image type:', mimetype);
                                                        return res.json({
                                                            success: false,
                                                            message: 'Unsupported image format'
                                                        });
                                                    }
                                                const filename = `${randomName}.${extension}`;

                                                console.log("Generated filename:", filename);
                                                // Extract filename from URL and determine extension dynamically
                                                // const originalFilename = post_image_url.split('/').pop();
                                                const originalFilename = filename;
                                                // Ensure the filename keeps its original extension
                                                const uniqueName = (req.global.getFormattedTime() + originalFilename).replace(/\s/g, "");
                                                const finalFilename = uniqueName.includes(`.${extension}`) ? uniqueName : uniqueName + `.${extension}`;
                                                const filePath = path.join(__dirname, "./public_media/customer/", finalFilename);

                                                // Save image
                                                fs.writeFile(filePath, imageResponse.data, (err) => {
                                                    if (err) {
                                                        console.error("Error saving image:", err);
                                                        return res.json({
                                                            success: false,
                                                            message: "Error saving image"
                                                        });
                                                    }

                                                    console.log('File saved to', filePath);
                                                    let Media = req.mongoose.model('Media');
                                                    let url = "customer/" + finalFilename;
                                                    let obj = [{name: finalFilename, url: url, type: mimetype}];
                                                    let photos = obj;

                                                    if (photos && photos[0]) {
                                                        Media.create({
                                                            name: photos[0].name,
                                                            url: photos[0].url,
                                                            type: photos[0].type
                                                        }, async function (err, media) {
                                                            if (err) {
                                                                console.error(err);
                                                                return res.json({
                                                                    success: false,
                                                                    message: "Error saving image"
                                                                });
                                                            }

                                                            const Post = req.mongoose.model("Post");

                                                            // Update thumbnail with correct image URL
                                                            body.thumbnail = "customer/" + finalFilename;

                                                            Post.create({
                                                                title: body?.title,
                                                                excerpt: body?.excerpt,
                                                                slug: body?.slug,
                                                                photos: [body?.thumbnail],
                                                                description: body?.description,
                                                                thumbnail: body?.thumbnail
                                                            }, function (err, post) {
                                                                if (err) {
                                                                    console.error(err);
                                                                    return res.json({
                                                                        success: false,
                                                                        message: "Error saving post"
                                                                    });
                                                                }

                                                                console.log('Post saved:', post);
                                                                res.json({
                                                                    success: true,
                                                                    message: "Post and image saved successfully",
                                                                    post: post
                                                                });
                                                            });
                                                        });
                                                    } else {
                                                        res.json({success: false, message: "Error saving image"});
                                                    }
                                                });
                                            }
                                        });
                                else {
                                    res.json({success: false, message: "No images found"});

                                }
                            } catch (err) {
                                console.error("Error downloading or saving the image:", err);
                                res.json({success: false, message: "Error downloading the image"});
                            }

                        }
                    });

                }
            }


        });

    return props;
}
