import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  name: {
    type: Schema.Types.String,
    maxlength: 255,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    maxlength: 255,
    unique: true,
    required: true,
  },
  gender: {
    type: Schema.Types.String,
    enum: ['female','male','others'],
    default: 'others',
  },
  phone: {
    type: Schema.Types.String,
    maxlength: 16,
    required: true,
  },
  role: {
    type: Schema.Types.String,
    enum: ['user','host','admin'],
    default: 'user',
  },
  country: {
    type: Schema.Types.String,
    maxlength: 20,
    required: true,
  },
  date_of_birth: {
    type: Schema.Types.Date,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    maxlength: 100,
    required: true,
  }
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userSchema.index({name: 1})

export const User = model('User', userSchema)


