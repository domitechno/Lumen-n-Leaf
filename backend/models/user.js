import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username:    { type: String, required: true, unique: true },
  email:       { type: String, required: true, unique: true },
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  password:    { type: String, required: true },
  role_id:     { type: Number, required: true},
  avatar: { type: String, default: '' }
});

export default model('User', userSchema);