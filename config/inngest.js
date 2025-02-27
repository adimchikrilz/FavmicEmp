import { Inngest } from "inngest";
import connectDB from "./db";
import  User  from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//inngest function to save user data to a databsase
// export const syncUserCreation = inngest.createFunction(
//     {
//         id:'sync-user-from-clerk'
//     },
//     {event: 'clerk/user.created'},
//     async ({event}) => {
//         const {id, first_name, last_name, email_addresses, image_url} = event.data
//         const userData = {
//             _id:id,
//             clerkId: id, // Add this line
//             email: email_addresses[0].email_address,
//             name: first_name + ' ' + last_name,
//             imageUrl:image_url
//         }
//         await connectDB()
//         await User.create(userData)
//     }
// )

export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        console.log("Clerk user creation event received:", event.data.id);
        
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            clerkId: id,
            email: email_addresses[0].email_address,
            name: first_name ? (first_name + ' ' + (last_name || '')) : "New User",
            imageUrl: image_url || "https://placeholder.com/user"
        }
        
        await connectDB()
        
        try {
            const newUser = await User.create(userData)
            console.log("User created successfully with ID:", newUser._id);
            return { success: true, userId: newUser._id };
        } catch (error) {
            console.error("Error creating user:", error.message);
            throw error;
        }
    }
)

//inngest function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {event: 'clerk/user.updated'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id,userData)
    }
)
//inngest function to update user data in database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)

// Inngest Function to create user's order in database
export const createUserOrder = inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    {event: 'order-created'},
    async({events}) => {

        const orders = events.map((event)=> {
            return{
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            }
        })

        await connectDB()
        await Order.insertMany(orders)

        return {success: true, processed: orders.length};
    }
)