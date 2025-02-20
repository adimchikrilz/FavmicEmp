// import { Inngest } from "inngest";
// import connectDB from "./db";
// import { User } from "@/models/User";

// // Create a client to send and receive events
// export const inngest = new Inngest({ id: "quickcart-next" });

// //inngest function to save user data to a databsase
// export const syncUserCreation = inngest.createFunction(
//     {
//         id:'sync-user-from-clerk'
//     },
//     {event: 'clerk/user.created'},
//     async ({event}) => {
//         const {id, first_name, last_name, email_addresses, image_url} = event.data
//         const userData = {
//             _id:id,
//             email: email_addresses[0].email_address,
//             name: first_name + ' ' + last_name,
//             imageUrl:image_url
//         }
//         await connectDB()
//         await User.create(userData)
//     }
// )

// //inngest function to update user data in database
// export const syncUserUpdation = inngest.createFunction(
//     {
//         id: 'update-user-from-clerk'
//     },
//     {event: 'clerk/user.updated'},
//     async ({event}) => {
//         const {id, first_name, last_name, email_addresses, image_url} = event.data
//         const userData = {
//             _id:id,
//             email: email_addresses[0].email_address,
//             name: first_name + ' ' + last_name,
//             imageUrl:image_url
//         }
//         await connectDB()
//         await User.findByIdAndUpdate(id,userData)
//     }
// )
// //inngest function to update user data in database
// export const syncUserDeletion = inngest.createFunction(
//     {
//         id: 'delete-user-with-clerk'
//     },
//     {event: 'clerk/user.deleted'},
//     async ({event}) => {
//         const {id} = event.data

//         await connectDB()
//         await User.findByIdAndDelete(id)
//     }
// )

import { Inngest } from "inngest";
import connectDB from "./db";
import mongoose from 'mongoose';

// Define the User model schema
const userSchema = new mongoose.Schema({
  _id: String,
  email: String,
  name: String,
  imageUrl: String
}, { timestamps: true });

// Create the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data

        try {
            await connectDB();
            // Make sure the connection is established before performing operations
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database connection not ready');
            }
            
            const result = await User.findByIdAndDelete(id);
            if (!result) {
                console.log('User not found:', id);
            }
            return { success: true, deletedUser: id };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
);

// Similarly update your other functions with proper error handling
export const syncUserCreation = inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    },
    {event: 'clerk/user.created'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        
        try {
            await connectDB();
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database connection not ready');
            }
            
            await User.create(userData);
            return { success: true, createdUser: id };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
);

export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {event: 'clerk/user.update'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        
        try {
            await connectDB();
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database connection not ready');
            }
            
            await User.findByIdAndUpdate(id, userData, { new: true });
            return { success: true, updatedUser: id };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
);