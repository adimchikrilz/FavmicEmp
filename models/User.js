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
// // export const User = mongoose.model('User', userSchema);

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     _id: { type: String, required: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     imageUrl: { type: String, required: true },
//     cartItems: { type: Object, default: {} }
// }, { minimize: false });

// // Check if model already exists, otherwise create it
// // Make sure to be consistent with case - use either 'user' or 'User' everywhere
// export const User = mongoose.models.user || mongoose.model('user', userSchema);

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     _id: { type: String, required: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     imageUrl: { type: String, required: true },
//     cartItems: { type: Object, default: {} }
// }, { minimize: false });

// // Use default export instead of named export
// const User = mongoose.models.user || mongoose.model('user', userSchema);
// export default User;