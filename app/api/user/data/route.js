import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const {userId} = getAuth(request)

        await connectDB()
        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json({success: false, message: "User Not Found"})
        }

        return NextResponse.json({success:true, user})

    } catch (error) {
        return NextResponse.json({success: false, message:error.message})
    }
}

// app/api/user/data/route.js
// import connectDB from "@/config/db";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//     try {
//         // Switch from getAuth to auth()
//         const { userId } = getAuth();
        
//         if (!userId) {
//             return NextResponse.json({ 
//                 success: false, 
//                 message: "Please sign in to continue"
//             });
//         }

//         await connectDB();
//         let user = await User.findOne({ clerkId: userId });

//         if (!user) {
//             user = await User.create({
//                 clerkId: userId,
//                 cartItems: {}
//             });
//         }

//         return NextResponse.json({ success: true, user });

//     } catch (error) {
//         console.error('Error in user data route:', error);
//         return NextResponse.json({ 
//             success: false, 
//             message: error.message
//         });
//     }
// }