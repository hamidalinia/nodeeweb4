import bcrypt from "bcrypt";

let Admin = {};
import global from '#root/global';

var self = ({
    all: function (req, res, next) {
        console.log('get all actions...')
        let Admin = req.mongoose.model('Admin');

        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        // if (req.query.user) {
        //
        //     search['user']=req.query.user;
        //
        // }
        // if (req.query.product) {
        //
        //     search['product']=req.query.product;
        //
        // }
        // console.log('search:',search,'limit:',req.params.limit,'offset:',offset)

        Admin.find(search,'_id email nickname role type page username active createdAt updatedAt', function (err, admins) {
            console.log('err',err)
            console.log('admins',admins)
            if (err) {
                return res.json({
                    success: false,
                    message: 'error!',
                    admins: admins
                });
            }
            Admin.countDocuments({}, function (err, count) {
                if (err || !count) {
                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                return res.json(admins);


            });

        }).skip(offset).sort({createdAt: -1,_id: -1}).limit(parseInt(req.params.limit));
    },

    login: function (req, res, next) {
        if (req.body.identifier && req.body.password) {
            let Admin = req.mongoose.model('Admin');
            Admin.authenticate(req.body.identifier, req.body.password, function (error, user) {
                if (error || !user) {
                    let err = new Error('Wrong email or password.');
                    err.status = 401;
                    res.status(401);
                    return res.json({'success': false, 'message': 'نام کاربری یا رمز عبور اشتباه!'});
                } else {
                    // req.session.userId = user._id;
                    return res.json({'success': true, 'message': 'در حال ریدایرکت...', 'user': user});
                }
            });
        } else {
            let err = new Error('All fields required.');
            err.status = 400;
            return res.json({'success': false, 'message': 'لطفا تمامی فیلد ها را تکمیل کنید!'});
        }
    },
    register: function (req, res, next) {
        if (req.body.email &&
            req.body.username &&
            req.body.password) {
            let Admin = req.mongoose.model('Admin');

            let userData = req.body;
            userData.type = 'user';
            userData.token = global.generateUnid();
            console.log('userData.token',userData.token)

            Admin.create(userData, function (error, user) {
                if (error) {

                    return res.json({err: error});
                } else {
                    user.success=true
                    return res.json(user);

                }
            });

        }
    },
    resetAdmin: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            let Admin = req.mongoose.model('Admin');

            Admin.exists({}, function (err, admin) {
                if (err || !admin) {
                    reject(err);
                } else {
                    let req = {
                        body: {
                            email: process.env.ADMIN_EMAIL,
                            username: process.env.ADMIN_USERNAME,
                            password: process.env.ADMIN_PASSWORD
                        }
                    };
                    self.register(req);
                }
            });
        });

    },
    breforeEdit: function (req, res, next) {},
    mainEdit: function (req, res, next) {
        let Admin = req.mongoose.model('Admin');

        Admin.findByIdAndUpdate(req.params.id, req.body,{new:true}, function (err, menu) {
            if (err || !menu) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err
                });
                return 0;
            }

            res.json(menu);
            return 0;

        });

    },
    edit: function (req, res, next) {

        return new Promise(function (resolve, reject) {
            console.log('edit admin...');
            if(req.body && req.body.password){
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        return next(err);
                    }
                    console.log('aftersave');
                    req.body.password = hash;
                    self.mainEdit(req,res,next);

                })
            }else{
                self.mainEdit(req,res,next);
            }
        });

    },
});
export default self;