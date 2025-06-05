import shell from 'shelljs';
import path from "path";
import fs from "fs";
import archiver from "archiver";
import _ from "lodash";
import global from "#root/global";
import {exec }from 'child_process'

var self = ({
    migrate3to4Template: async function (req, res, next) {
        const Template = req.mongoose.model('Template');

        function transformElementToItemType(element) {
            const {
                id,
                label,
                name,
                addable,
                settings,
                children = []
            } = element;

            const generalFields = settings?.general?.fields || {};

            const cssFieldNames = [
                "textAlign", "position", "animation", "background", "top", "bottom", "right",
                "border", "left", "boxShadow", "zIndex", "color", "float", "borderRadius",
                "direction", "width", "maxWidth", "height", "fontFamily", "maxHeight",
                "backgroundColor", "margin", "marginTop", "marginBottom", "padding", "fontWeight",
                "fontSize", "lineHeight", "display", "paddingTop", "paddingBottom", "marginLeft",
                "marginRight", "paddingLeft", "paddingRight", "flex", "gap", "flexWrap",
                "flexDirection", "justifyContent", "alignItems", "borderBottom", "backgroundSize",
                "borderBottomWidth", "borderBottomColor", "borderBottomStyle", "borderTop",
                "borderLeft", "borderRight", "alignContent", "backgroundImage",
                "backgroundPosition", "backgroundrepeat", "minHeight", "overflow",
                "backgroundAttachment", "overflowY", "overflowX"
            ];

            const styleFields = {};
            const contentFields = {};
            let hasStyleFields = false;
            let hasContentFields = false;

            for (const key in generalFields) {
                const value = generalFields[key];
                if (value === undefined || value === null || value === "") continue;

                if (cssFieldNames.includes(key)) {
                    styleFields[key] = value;
                    hasStyleFields = true;
                } else if (key !== "showInDesktop" && key !== "showInMobile") {
                    contentFields[key] = value;
                    hasContentFields = true;
                }
            }

            const responsiveFields = {};
            if (generalFields.showInDesktop === true) responsiveFields.showInDesktop = true;
            if (generalFields.showInMobile === true) responsiveFields.showInMobile = true;

            const settingsObj = {};
            if (hasStyleFields) settingsObj.style = styleFields || {};
            if (hasContentFields) settingsObj.content =contentFields || {};
            if (Object.keys(responsiveFields).length > 0) settingsObj.responsive = responsiveFields;

            const item = {
                ...(id && { id }),
                ...(label && { label }),
                type: name,
                ...(addable !== undefined && { addable }),
                ...(Object.keys(settingsObj).length > 0 && { settings: settingsObj }),
                ...(children.length > 0 && {
                    children: children.map(transformElementToItemType),
                }),
            };

            return item;
        }

        try {
            const templates = await Template.find({});

            for (const t of templates) {
                const transformedElements = Array.isArray(t.elements)
                    ? t.elements.map(transformElementToItemType)
                    : [];
// return res.json({elements:transformedElements})
                await Template.findByIdAndUpdate(t._id, {
                    $set: { elements: transformedElements }
                });
            }

            res.json({ success: true, message: "Templates migrated successfully." });
        } catch (error) {
            console.error("Migration failed:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
    migrate3to4Page: async function (req, res, next) {
        const Page = req.mongoose.model('Page');

        function transformElementToItemType(element) {
            const {
                id,
                label,
                name,
                addable,
                settings,
                children = []
            } = element;

            const generalFields = settings?.general?.fields || {};

            const cssFieldNames = [
                "textAlign", "position", "animation", "background", "top", "bottom", "right",
                "border", "left", "boxShadow", "zIndex", "color", "float", "borderRadius",
                "direction", "width", "maxWidth", "height", "fontFamily", "maxHeight",
                "backgroundColor", "margin", "marginTop", "marginBottom", "padding", "fontWeight",
                "fontSize", "lineHeight", "display", "paddingTop", "paddingBottom", "marginLeft",
                "marginRight", "paddingLeft", "paddingRight", "flex", "gap", "flexWrap",
                "flexDirection", "justifyContent", "alignItems", "borderBottom", "backgroundSize",
                "borderBottomWidth", "borderBottomColor", "borderBottomStyle", "borderTop",
                "borderLeft", "borderRight", "alignContent", "backgroundImage",
                "backgroundPosition", "backgroundrepeat", "minHeight", "overflow",
                "backgroundAttachment", "overflowY", "overflowX"
            ];

            const styleFields = {};
            const contentFields = {};
            let hasStyleFields = false;
            let hasContentFields = false;

            for (const key in generalFields) {
                const value = generalFields[key];
                if (value === undefined || value === null || value === "") continue;

                if (cssFieldNames.includes(key)) {
                    styleFields[key] = value;
                    hasStyleFields = true;
                } else if (key !== "showInDesktop" && key !== "showInMobile") {
                    contentFields[key] = value;
                    hasContentFields = true;
                }
            }

            const responsiveFields = {};
            if (generalFields.showInDesktop === true) responsiveFields.showInDesktop = true;
            if (generalFields.showInMobile === true) responsiveFields.showInMobile = true;

            const settingsObj = {};
            if (hasStyleFields) settingsObj.style =  styleFields || {};
            if (hasContentFields) settingsObj.content = contentFields ;
            if (Object.keys(responsiveFields).length > 0) settingsObj.responsive = responsiveFields;

            const item = {
                ...(id && { id }),
                ...(label && { label }),
                type: name,
                ...(addable !== undefined && { addable }),
                ...(Object.keys(settingsObj).length > 0 && { settings: settingsObj }),
                ...(children.length > 0 && {
                    children: children.map(transformElementToItemType),
                }),
            };

            return item;
        }

        try {
            const pages = await Page.find({});

            for (const t of pages) {
                const transformedElements = Array.isArray(t.elements)
                    ? t.elements.map(transformElementToItemType)
                    : [];
// return res.json({elements:transformedElements})
                await Page.findByIdAndUpdate(t._id, {
                    $set: { elements: transformedElements }
                });
            }

            res.json({ success: true, message: "pages migrated successfully." });
        } catch (error) {
            console.error("Migration failed:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
    migrate4to5Template: async function (req, res, next) {
        const Template = req.mongoose.model('Template');

        function transformElementToItemType(element) {
            const {
                id,
                label,
                name,
                addable,
                settings,
                children = []
            } = element;

            const generalFields = settings?.general?.fields || {};

            const cssFieldNames = [
                "textAlign", "position", "animation", "background", "top", "bottom", "right",
                "border", "left", "boxShadow", "zIndex", "color", "float", "borderRadius",
                "direction", "width", "maxWidth", "height", "fontFamily", "maxHeight",
                "backgroundColor", "margin", "marginTop", "marginBottom", "padding", "fontWeight",
                "fontSize", "lineHeight", "display", "paddingTop", "paddingBottom", "marginLeft",
                "marginRight", "paddingLeft", "paddingRight", "flex", "gap", "flexWrap",
                "flexDirection", "justifyContent", "alignItems", "borderBottom", "backgroundSize",
                "borderBottomWidth", "borderBottomColor", "borderBottomStyle", "borderTop",
                "borderLeft", "borderRight", "alignContent", "backgroundImage",
                "backgroundPosition", "backgroundrepeat", "minHeight", "overflow",
                "backgroundAttachment", "overflowY", "overflowX"
            ];

            const styleFields = {};
            const contentFields = {};
            let hasStyleFields = false;
            let hasContentFields = false;

            for (const key in generalFields) {
                const value = generalFields[key];
                if (value === undefined || value === null || value === "") continue;

                if (cssFieldNames.includes(key)) {
                    styleFields[key] = value;
                    hasStyleFields = true;
                } else if (key !== "showInDesktop" && key !== "showInMobile") {
                    contentFields[key] = value;
                    hasContentFields = true;
                }
            }

            const responsiveFields = {};
            if (generalFields.showInDesktop === true) responsiveFields.showInDesktop = true;
            if (generalFields.showInMobile === true) responsiveFields.showInMobile = true;

            const settingsObj = {};
            if (hasStyleFields) settingsObj.style = styleFields;
            if (hasContentFields) settingsObj.content = contentFields;
            if (Object.keys(responsiveFields).length > 0) settingsObj.responsive = responsiveFields;

            // Copy other custom settings (style/content) directly if they exist and aren't in 'general'
            if (settings?.style?.fields) {
                settingsObj.style = {
                    ...settingsObj.style,
                    ...settings.style.fields
                };
            }
            if (settings?.content?.fields) {
                settingsObj.content = {
                    ...settingsObj.content,
                    ...settings.content.fields
                };
            }

            const item = {
                ...(id && { id }),
                ...(label && { label }),
                type: name,
                ...(addable !== undefined && { addable }),
                ...(Object.keys(settingsObj).length > 0 && { settings: settingsObj }),
                ...(children.length > 0 && {
                    children: children.map(transformElementToItemType),
                }),
            };

            return item;
        }


        try {
            const templates = await Template.find({});

            for (const t of templates) {
                const transformedElements = Array.isArray(t.elements)
                    ? t.elements.map(transformElementToItemType)
                    : [];
// return res.json({elements:transformedElements})
                await Template.findByIdAndUpdate(t._id, {
                    $set: { elements: transformedElements }
                });
            }

            res.json({ success: true, message: "Templates migrated successfully." });
        } catch (error) {
            console.error("Migration failed:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    functions: function (req, res, next) {
        let functions = req.functions() || [];
        return res.json(functions);
    },
    events: function (req, res, next) {
        let events = req.events() || [];
        return res.json(events);
    },
    deactivatePlugin: function (req, res, next) {
        console.log('deactivatePlugin')
        let plugin = req.body;
        if (plugin && plugin.path && plugin.name) {
            let __dirname = path.resolve();
            let pluginPath = path.join(__dirname, "./plugins", plugin.name);
            let newPluginPath = path.join(__dirname, "./plugins", plugin.name + '-deactive');
            const scripts = path.join(__dirname, "node_modules/@nodeeweb/server/scripts");

            shell.exec('sh ' + scripts + `/mv.sh ${pluginPath} ${newPluginPath}`);
            // console.log('newPluginPath', newPluginPath)
            return res.json({
                success: true,
            })
        } else {
            return res.json({
                success: false
            })
        }
    },
    activatePlugin: function (req, res, next) {
        console.log('activatePlugin')
        let plugin = req.body;
        if (plugin && plugin.path && plugin.name) {
            let __dirname = path.resolve();
            let pluginPath = path.join(__dirname, "./plugins", plugin.name);
            let newPluginPath = path.join(__dirname, "./plugins", plugin.name.replace('-deactive', ''));
            const scripts = path.join(__dirname, "node_modules/@nodeeweb/server/scripts");

            shell.exec('sh ' + scripts + `/mv.sh ${pluginPath} ${newPluginPath}`);
            // console.log('newPluginPath', newPluginPath)
            return res.json({
                success: true,
            })
        } else {
            return res.json({
                success: false
            })
        }
    },
    plugins: function (req, res, next) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    callback(
                        files
                            .filter(dirent => {
                                return (dirent.isDirectory() && (dirent.name.indexOf('deactive') == -1))
                            })
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, (item) => {
                item.path = '/' + item.name + '/index.js'
                item.image = '/' + item.name + '/image.jpg'
            })
            return res.json(f);
        });


    },
    market: function (req, res, next) {


    },
    updatePluginRules: function (req, res, next) {
        let pluginName = req.params.plugin;
        let Settings = req.mongoose.model('Settings');

        Settings.findOne({}, 'plugins', function (err, setting) {
            if (!setting.plugins) {
                setting.plugins = {};
            }
            setting.plugins[pluginName] = req.body;
            console.log('setting.plugins', setting.plugins)
            Settings.findOneAndUpdate({}, {$set: {plugins: setting.plugins}}, {
                projection: {
                    plugins: 1
                },
            }, function (err, setting) {
                if (err && !setting) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error"
                    });
                }
                res.json({success: true, setting})

            });
        });
    },
    pluginRules: function (req, res, next) {
        // let Settings = req.mongoose.model('Settings');
        if (req.props['plugin'] && req.props['plugin'][req.params.plugin]) {

            let Settings = req.mongoose.model('Settings');

            Settings.findOne({}, 'plugins', function (err, setting) {
                if (!setting.plugins) {
                    setting.plugins = [];
                }


                // console.log('setting.plugins[req.params.plugin]', setting.plugins[req.params.plugin])
                console.log('req.props[\'plugin\']', req.props['plugin'])
                _.forEach(req.props['plugin'][req.params.plugin], (item, j) => {
                    if (setting.plugins[req.params.plugin]) {

                        req.props['plugin'][req.params.plugin][j].value = setting.plugins[req.params.plugin][item.name];
                    }
                })
                return res.json({fields: req.props['plugin'][req.params.plugin]})

            })
        } else
            return res.json({fields: []})
    },
    deActivePlugins: function (req, res, next) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    callback(
                        files
                            .filter(dirent => {
                                return (dirent.isDirectory() && (dirent.name.indexOf('deactive') > -1))
                            })
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, (item) => {
                item.path = '/' + item.name + '/index.js'
                item.image = '/' + item.name + '/image.jpg'
            })
            return res.json(f);
        });


    },
    configuration: function (req, res, next) {
        console.log("edit configuration...")
        let Settings = req.mongoose.model('Settings');

        Settings.findOneAndUpdate({}, req.body, {new: true}, function (err, setting) {


            if (err && !setting) {


                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });

            }
            // self.updateImportantFiles(res,setting);
            self.updateCssFile(res, setting);


            // file.pipe(fstream);
            // fstream.on("close", function() {
            //
            // });
            res.json({success: true, setting})

        });

    },
    updateCssFile: function (res, setting) {
        console.log("updateCssFile",setting)
        let __dirname = path.resolve()
        let css = ":root {\n" +
            "    --blue: #674eec;\n" +
            "    --primary: "+(setting?.primaryColor ? setting?.primaryColor : "#ff31b8")+";\n" +
            "    --indigo: #674eec;\n" +
            "    --purple: #8445f7;\n" +
            "    --pink: #ff4169;\n" +
            "    --red: #c4183c;\n" +
            "    --orange: #fb7906;\n" +
            "    --yellow: #ffb400;\n" +
            "    --green: #17c671;\n" +
            "    --teal: #1adba2;\n" +
            "    --cyan: #00b8d8;\n" +
            "    --white: #fff;\n" +
            "    --gray: #868e96;\n" +
            "    --gray-dark: #343a40;\n" +
            "    --secondary: "+(setting?.secondaryColor ? setting?.secondaryColor : "#00ccff")+";\n" +
            "    --add-to-cart-text: "+(setting?.addToCartTextColor ? setting?.addToCartTextColor : "#fff")+";\n" +
            "    --add-to-cart: "+(setting?.addToCartColor ? setting?.addToCartColor : "#00ccff")+";\n" +
            "    --add-to-cart-hover: " + (setting?.addToCartHoverColor ? setting?.addToCartHoverColor : "#ff31b8")+";\n" +
            "    --success: #17c671;\n" +
            "    --info: #00b8d8;\n" +
            "    --warning: #ffb400;\n" +
            "    --danger: #c4183c;\n" +
            "    --light: #FBFBFB;\n" +
            "    --dark: #212529;\n" +
            "    --bg-color: #ffffff;\n" +
            "    --footer-bg-color: #ffffff;\n" +
            "    --text-color: #000000;\n" +
            "    --breakpoint-xs: 0;\n" +
            "    --breakpoint-sm: 576px;\n" +
            "    --breakpoint-md: 768px;\n" +
            "    --breakpoint-lg: 992px;\n" +
            "    --breakpoint-xl: 1200px;\n" +
            "    --font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n" +
            "    --font-family-monospace: 'Roboto Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace\n" +
            "}";
        global.updateFile(
            './theme/site_setting/',
            'theme.css',
            css,
            __dirname
        );
        global.updateFile(
            './public_media/site_setting/',
            'theme.css',
            css,
            __dirname
        );
    },
    last: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss[0] && settingss[0].data)
                res.json(settingss[0].data);
            else
                res.json([]);
            return 0;


        }).skip(offset).sort({_id: -1}).limit(1);
        // res.json([]);
    },
    customerStatus: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'customerStatus', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss.customerStatus)
                res.json(settingss.customerStatus);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    formStatus: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("formStatus ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'formStatus', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss.formStatus)
                res.json(settingss.formStatus);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    factore: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'factore_shop_name factore_shop_site_name factore_shop_address factore_shop_site_address factore_shop_phoneNumber factore_shop_faxNumber factore_shop_postalCode factore_shop_submitCode factore_shop_internationalCode', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss)
                res.json(settingss);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    restart: function (req, res, next) {
        return
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME || "";
        site = site.toLowerCase();
        console.log("Site ==> ", site);
        // console.log("dirname ===> " ,_dirname);
        const scripts = path.join(_dirname, "node_modules/@nodeeweb/server/scripts");
        console.log("scripts ==> ", 'sh ' + scripts + `/restart.sh ${site}`);
        res.json({
            success: true
        })
        shell.exec('sh ' + scripts + `/restart.sh ${site}`);

    },
    update: function (req, res, next) {
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME;
        site = site.toLowerCase();
        console.log("Site ==> ", site);
        // console.log("dirname ===> " ,_dirname);
        const scripts = path.join(_dirname, "node_modules/@nodeeweb/server/scripts");
        console.log("scripts ==> ", 'sh ' + scripts + `/update.sh ${site}`);
        res.json({
            success: true
        })
        shell.exec('sh ' + scripts + `/update.sh ${site}`);
    },
    fileUpload: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');
        let Media = req.mongoose.model('Media');

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
                // console.log("on file app filePath", fieldname, file, filename, encoding, mimetype);
                if (!(filename && filename.filename)) {
                    res.json({
                        success: false
                    });
                    return 0;
                }
                let exention = filename.filename.split(".");
                // if (filename.mimetype.toString().includes('image')) {
                //   // name+=".jpg"
                // }
                // if (filename.mimetype.toString().includes('video')) {
                //   // name+="mp4";
                // }
                let name = "logo." + exention[1];
                let __dirname = path.resolve();

                let filePath = path.join(__dirname, "./public_media/site_setting/", name);

                fstream = fs.createWriteStream(filePath);
                // console.log('on file app mimetype', typeof filename.mimeType);

                file.pipe(fstream);
                fstream.on("close", function () {
                    // console.log('Files saved');
                    let url = "site_setting/" + name;
                    let obj = [{name: name, url: url, type: mimetype}];
                    req.photo_all = obj;
                    let photos = obj;
                    if (photos && photos[0]) {
                        Media.create({
                            name: photos[0].name,
                            url: photos[0].url,
                            type: photos[0].type,
                            theKey: "logo"

                        }, function (err, media) {


                            if (err && !media) {


                                res.json({
                                    err: err,
                                    success: false,
                                    message: "error"
                                });

                            }
                            Settings.findOneAndUpdate({}, {
                                logo: photos[0].url
                            }, {new: true}, function (err, setting) {


                                if (err && !setting) {


                                    res.json({
                                        err: err,
                                        success: false,
                                        message: "error"
                                    });

                                }
                                // console.log('setting',setting);
                                // console.log('media',media);
                                res.json(setting);

                            });

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
exportInfo: function(req, res, next) {
    let __dirname = path.resolve();
    const tmpDir = path.join(__dirname, 'tmp');
    const publicMediaDir = path.join(__dirname, 'public_media');

    // Get current date in YYYY-MM-DD format
    const date = new Date().toISOString().split('T')[0]; // Example: "2024-11-23"
    let zipName = `backup-${date}.zip`; // Example: "backup-2024-11-23.zip"
    let zipPath = path.join(tmpDir, zipName);
    let zipDestinationPath = path.join(publicMediaDir, zipName);

    // Step 1: Ensure tmp directory exists
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    // Step 2: Check if a file with the same name already exists in public_media
    if (fs.existsSync(zipDestinationPath)) {
        // If it exists, create a new unique name for the zip file with a timestamp
        const timestamp = Date.now();
        zipName = `backup-${date}_${timestamp}.zip`; // Example: "backup-2024-11-23_1709345075049.zip"
        zipPath = path.join(tmpDir, zipName);
        zipDestinationPath = path.join(publicMediaDir, zipName);
    }

    // Step 3: Perform MongoDB dump
    const mongoDumpDir = path.join(tmpDir, 'mongo_dump');
    const mongoDumpCommand = `mongodump --uri ${process.env.mongodbConnectionUrl} --out ${mongoDumpDir} --db ${process.env.dbName}`;
    exec(mongoDumpCommand, (err, stdout, stderr) => {
        if (err) {
            console.error('Error creating MongoDB dump:', err);
            return res.status(500).send('Failed to create MongoDB dump');
        }
        console.log('MongoDB dump completed:', stdout);

        // Step 4: Create the zip file
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Archive created successfully. Total size: ${archive.pointer()} bytes`);

            // Step 5: Move the zip file to the public_media directory
            fs.rename(zipPath, zipDestinationPath, (err) => {
                if (err) {
                    console.error('Error moving zip file:', err);
                    return res.status(500).send('Failed to move the zip file');
                }

                // Step 6: Delete the tmp folder
                fs.rm(tmpDir, { recursive: true, force: true }, (err) => {
                    if (err) {
                        console.error('Error deleting tmp folder:', err);
                        return res.status(500).send('Failed to delete tmp folder');
                    }
                    console.log('Temporary folder deleted successfully.');
                });

                const downloadUrl = `${process.env.BASE_URL}/${zipName}`;
                // Respond with success message
                res.json({
                    success: true,
                    message: "Archive created and moved to public_media as " + zipName,
                    downloadUrl: downloadUrl
                });
            });
        });

        archive.on('error', (err) => {
            console.error('Error creating archive:', err);
            return res.status(500).send('Failed to create zip file');
        });

        archive.pipe(output);

        // Add the public_media directory and MongoDB dump to the archive
        archive.directory(publicMediaDir, 'public_media'); // Add public_media folder
        archive.directory(mongoDumpDir, 'mongo_dump');     // Add MongoDB dump folder

        // Finalize the archive
        archive.finalize();
    });
}
,


});
export default self;