import bcrypt from "bcrypt";
import global from "#root/global";

export default (mongoose) => {
    const CustomerSchema = new mongoose.Schema({
        email: {
            type: String,
            required: false,
            trim: true,
        },
        phoneNumber: {
            type: String,
            unique: false,
            required: false,
            trim: true,
        },
        nickname: {
            type: String,
        },
        firstName: String,
        expire: Date,
        lastName: String,
        birth_day: String,
        birth_month: String,
        birthday: String,
        birthdate: {type: Date},
        internationalCode: String,
        sex: String,
        source: {type: String, default: "WEBSITE"},
        role: {type: String, default: "customer"},
        bankData: {},
        data: {},
        type: {
            type: String,
            required: false,
            default: "user",
        },
        contacts: [
            {_id: {type: mongoose.Schema.Types.ObjectId, ref: "Customer"}},
        ],
        campaign: [
            {
                _id: {type: mongoose.Schema.Types.ObjectId, ref: "Campaign"},
                status:String,
                token:String,
                message:String
            },
        ],
        wishlist: [
            {_id: {type: mongoose.Schema.Types.ObjectId, ref: "Product"}},
        ],
        customerGroup: [
            {type: mongoose.Schema.Types.ObjectId, ref: "CustomerGroup"},
        ],
        password: String,
        heart: {type: Number},
        age: {type: Number},
        whatsapp: {type: Boolean, default: false},
        active: {type: Boolean, default: true},
        activationCode: Number,
        tokens: [{token: String, os: String}],
        notificationTokens: [
            {token: String, updatedAt: {type: Date, default: Date.now}},
        ],
        credit: {type: Number, default: 0},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        score: {type: Number, default: 0},
        invitationCode: Number,
        invitation_list: [
            {
                customer_id: String,
            },
        ],
        status: [
            {
                createdAt: {type: Date, default: Date.now},
                description: String,
                status: String,
                user: {type: mongoose.Schema.Types.ObjectId, ref: "Admin"},
            },
        ],
        photos: [
            {
                name: String,
                url: String,
            },
        ],
        companyName: String,
        companyTelNumber: String,
        comments: [],
        address: [],
        tests: [
            {
                test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
                passed: { type: Boolean, default: false },
                score: { type: Number, default: 0 },
            }
        ]
    });

    //authenticate input against database
    CustomerSchema.statics.authenticate = function (
        phoneNumber,
        password,
        callback
    ) {
        const Customer = mongoose.model("Customer", CustomerSchema);
        Customer.findOne(
            {phoneNumber: phoneNumber},
            "_id , photos , nickname , firstName , lastName , email , password , tokens  , phoneNumber , address , authCustomerWithPassword , internationalCode"
        )
            .lean()
            .exec(function (err, user) {
                if (err) {
                    return callback(err);
                } else if (!user) {
                    let err = new Error("User not found.");
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        delete user.password;
                        // var token='';
                        if (user.tokens && user.tokens.length) {
                            user.token = user.tokens[user.tokens.length - 1].token;
                        }

                        if (!user.tokens || !user.tokens.length) {
                            console.log("no token found", user.tokens);

                            let Token = global.generateUnid();
                            Customer.findByIdAndUpdate(
                                user._id,
                                {
                                    $push: {tokens: {token: Token}},
                                },
                                function (err, post) {
                                }
                            );
                            user.token = Token;
                        }
                        delete user.tokens;
                        if (user?.photos && user?.photos?.length) {
                            user.photos = [user.photos[user.photos.length - 1]];
                        }

                        return callback(null, user);
                    } else {
                        return callback();
                    }
                });
            });
    };

    return CustomerSchema;
    // module.exports = mongoose.model('User', UserSchema);

    // return mongoose.model('Settings', SettingsSchema);
    // export default mongoose.model('User', UserSchema);

    // return User
};
