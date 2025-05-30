import SftpClient from 'ssh2-sftp-client';
import ftp from 'basic-ftp';
import child_process from 'child_process';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

let __dirname = path.resolve();

export default (props) => {
    // console.log("backup-gateway",props);

    function backup(req, res, next) {
        console.log('========== Running backup func ==========');
        let Settings = req.mongoose.model('Settings');
        // console.log('req',req.mongoose)
        // console.log('props',props)
        // req.global.fireEvent('backup-completion',{},props,req,res,next);
        // return
        Settings.findOne({}, 'plugins', async function (err, setting) {
            // console.log('setting:',setting)
            if (!setting.plugins && res) res.json({success: false});

            if (!setting.plugins['backup-gateway'] && res) res.json({success: false});

            // console.log('testing backup==================================');
            // return ;
            // return reject({})

            let {username = null, password = null, host = null, port = null, dir = null} = setting.plugins['backup-gateway'];
            let {ftpusername = null, ftppassword = null, ftphost = null, ftpport = null, ftpdir = null} = setting.plugins['backup-gateway'];

            if (!port) {
                port = 22
            }
            ;

            const config = {username, password, host, port};
            const ftpconfig = {ftpusername, ftppassword, ftphost, ftpport};

            // console.log();

            let siteDir = path.dirname(__dirname)
            let siteName = process.env.SITE_NAME;
            let dbName = process.env.dbName;
            console.log(`site: ${siteName}, db: ${dbName}, siteDir: ${siteDir}`);

            // 1. Running the backup scripts to create a backup of the files
            const child = child_process.spawn('bash', ['/home/backupScripts/nodebackup.sh', siteDir, dbName, siteName]);
            child.on('exit', () => {
                console.log('finished backup script.');
                console.log('Uploading files ===================>\n');

                let upFile;
                fs.readdir(`/home/backupScripts/arvandBackup/${siteName + 'backup'}`, async function (err, dirs) {
                    if (err) return console.log('error reading directory: ', err);

                    _.forEach(dirs, (dir) => {
                        console.log('dir: ', dir);
                        upFile = dir;
                    });

                    console.log('upfile: ', upFile);

                    let src = path.join('/home/backupScripts/arvandBackup', siteName + 'backup', upFile);
                    let dst = path.join('/home/arvand/backupFiles', siteName + 'backup');
                    let ftpdst = path.join('/home/arvand/backupFiles', siteName + 'backup');
                    console.log('dst before: ', dst);
                    // if(dir != null) dst = dir;
                    // if(ftpdir != null) ftpdst = ftpdir;


                    console.log(`src: ${src}, dst: ${dst}`);

                    let fileObjects;
                    let fileNames = [];

                    if (username && password && host && port) {
                        const client = new SftpClient('upload-backup');

                        try {
                            console.log('Uploading through SFTP');
                            req.global.fireEvent('backup-completion',{},props,req,res,next);

                            await client.connect(config);
                            client.on('upload', info => {
                                console.log(`Listener: Uploaded ${info.source}`);

                            });
                            let rslt = await client.uploadDir(src, dst);
                            console.log(rslt);
                        } catch (err) {
                            console.log(err);
                        } finally {
                            client.end();

                        }

                        // ending sftp if
                    }

                    if (ftpusername && ftppassword && ftphost && ftpport) {
                        const clientFtp = new ftp.Client();

                        try {
                            console.log('Uploading through FTP');

                            await clientFtp.access({
                                host: ftphost,
                                user: ftpusername,
                                password: ftppassword
                                // secure: true
                            });
                            // client.ftp.verbose = true
                            await clientFtp.ensureDir(ftpdst);
                            console.log(await clientFtp.list());
                            // clientFtp.trackProgress(info => console.log(info.bytesOverall));
                            await clientFtp.uploadFromDir(src);
                            // console.log(up);
                        } catch (err) {
                            console.log(err);
                        } finally {
                            clientFtp.close();

                        }

                        // ending ftp if
                    }
                    const delBackup = child_process.spawn('bash', ['/home/backupScripts/backupdel.sh']);
                    child.on('exit', () => {

                        console.log('Deleted backup files.');

                    });
                    child.stdout.pipe(process.stdout);
                    child.stderr.pipe(process.stderr);

                    // ending fs
                });

                // ending child_process
            });
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);

            // ending settings
        });
        if (res) res.json({message: 'done'});
        console.log('---------- done backing up. ----------');

        // ending plugin function
    }

    // _.forEach()
    if (props && props.entity)
        if (!props.schedules) {
            props.schedules = []
        }
    // delete props.entity;
    // console.log('reading this ================================');
    // console.log(props);
    // return;
    // props.global.getSetting('plugins')
    //   .then((plugins) => {
    //     console.log(plugins);
    //   })

    // props.schedules.push({setting: "0 30 0 * * *", name: 'run-backup', path: 'backup-gateway', variable: 'crontime'})
    props.entity.map((item, i) => {
        if (item.name === 'settings') {

            if (item.routes)
                item.routes.push({
                    "path": "/status/backup/",
                    "method": "post",
                    "access": "customer_all",
                    "controller": (req, res, next) => {
                        backup(req, res, next);
                    }
                })

            if (!item.hook) item.hook = [];
            // item.hook.push({
            //     event: 'run-backup',
            //     name: 'run backup',
            //     func: (req, res, next, params) => {
            //         console.log('running backup now', new Date());
            //         backup(req, res, next);
            //     }
            // })

        }

    })
    props['plugin']['backup-gateway'] = [
        {name: "username", value: '', label: "server username"},
        {name: "password", value: '', label: "server password"},
        {name: "host", value: '', label: "server ip"},
        {name: "port", value: '', label: "port"},
        {name: "dir", value: '', label: "upload directory(not necessary)"},
        {name: "ftpusername", value: '', label: "ftp server username"},
        {name: "ftppassword", value: '', label: "ftp server password"},
        {name: "ftphost", value: '', label: "ftp server ip"},
        {name: "ftpport", value: '', label: "ftp port"},
        {name: "ftpdir", value: '', label: "ftp upload directory(not necessary)"},
        {name: "crontime", value: '', label: "cron job time format"},
    ];
    return props;
}
