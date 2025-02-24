import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    _id: { type:String, required:true },
    name: { type:String, required:true },
    email: { type:String, required:true, unique:true },
    imageUrl: { type:String, required:true },
    cartItems: { type:Object, default:{} }
}, {minimize:false})

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
// models/User.js
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   clerkId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: String,
//   email: String,
//   imageUrl: String,
//   cartItems: {
//     type: Map,
//     of: Number,
//     default: {}
//   }
//   // ... other fields
// });

// export default mongoose.models.User || mongoose.model('User', userSchema);