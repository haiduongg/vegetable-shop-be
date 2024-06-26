const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      'https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg',
    trim: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

UserSchema.pre('save', async function(next){
  try {
    console.log(`Called before save::: ${this.email} ${this.password} `);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isCheckedPasswrod = async function(password, next){
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    next(error)
  }
}

module.exports = mongoose.model('User', UserSchema);
