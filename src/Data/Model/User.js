const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('../../utilities/jsonWebToken');

const SALT_WORK_FACTOR = 12

//define the user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'firstName is required'] },
    middleName: { type: String, default: '' },
    lastName: { type: String, required: [true, 'lastName is required'] },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, 'email is required'],
        default: '',
    },

    password: { type: String, default: '', trim: true },
    phone: { type: String, default: '' },
    privacy: {
        isEmailPrivate: { type: Boolean, default: false },
        isPhonePrivate: { type: Boolean, default: false },
    },
    profileImage: { type: String, default: 'default.png' },
    twitter: { type: String, default: '' },
    twitterTokens: Object,

    createdAt: { type: Date, default: Date.now() },
    accessTokens: {
        type: String,
        trim: true,
        unique: true, // creates a MongoDB index, ensuring unique values
        sparse: true, // this makes sure the unique index applies to not null values only (= unique if not null)
        default: null,
    }
}, {
    timestamps: true,
})

/**
 * Before saving the user password generate the salt and create the hash
 */
userSchema.pre('save', function preSave(next) {
        //assign the current object to the variable
        const user = this
        if (user.password == '') return next()
            //only hash the password if it has been modified or is new
        if (user.isModified('password') || user.isNew) {
            //generate salt
            return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                if (err) return next(err)
                    //hash the password using the generated salt
                return bcrypt.hash(user.password, salt, (hasherr, hash) => {
                    if (hasherr) next(hasherr)
                        //override the clear text password with the hashed password
                    user.password = hash
                    return next()
                })
            })
        }
        return next()
    })
    /**
     * Decrypts the encrypted password and compares it to the provided password during login
     * @param candidatePassword String - plain password
     */
userSchema.methods.comparePassword = function(candidatePassword) {
    //bcrypt.compare() comapres the passed password with the one in our database it returns a true or false
    return bcrypt.compare(candidatePassword, this.password)
}

/**
 * creates jwt token for users
 * @paran userID string -plain id
 * 
 */
userSchema.methods.createToken = function() {
    try{
        this.audience = 'user'
        const JWT = new jwt(this)
        return JWT.create()
    }catch(err){
if(err.message){
    return({error:err.message});
}else{
    return({error:err});
}
    }

}

/**
 * creates a refresh token for the user
 */
userSchema.methods.createRefreshToken = async function() {
    try{
         const refreshToken = crypto.randomBytes(30).toString('hex');
    this.refreshToken = crypto
        .createHash('sha512')
        .update(refreshToken)
        .digest('hex');
    await this.save(); //
    return refreshToken;
    }catch(err){
if(err.message){
    return({error:err.message});
}else{
    return({error:err});
}
 }
   
};



module.exports = mongoose.model('User', userSchema)