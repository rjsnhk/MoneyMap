const moongose = require('mongoose');

const bycrypt = require('bcryptjs');

const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: null,
    }
  }
    ,{
        timestamps: true,
    }
);
// Method to compare password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
        this.password = await bycrypt.hash(this.password, 10);
        next();
    
});
// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bycrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = moongose.model('User', userSchema);