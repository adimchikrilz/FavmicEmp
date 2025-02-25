// import { inngest } from "@/config/inngest";
// import Product from "@/models/Product";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";



// export async function POST(request) {
//     try {
        
//         const {userId} = getAuth(request)
//         const {address, items} = await request.json();

//         if (!address || items.length === 0) {
//             return NextResponse.json({success: false, message: 'invalid data'});
//         }

//         //calculate amount using items
//         const amount = await items.reduce(async (acc, item) => {
//             const product = await Product.findById(item.product);
//             return await acc + product.offerPrice * item.quantity;
//         },0)

//         await inngest.send({
//             name: 'order/created',
//             data: {
//                 userId,
//                 address,
//                 items,
//                 amount: amount + Math.floor(amount * 0.02),
//                 date: Date.now()
//             }
//         })

//         //clear user cart
//         const user = await User.findById(userId)
//         user.cartItems = {}
//         await user.save()

//         return NextResponse.json({success: true, message: 'Order Placed'})

//     } catch (error) {
//         console.log(error)
//         return NextResponse.json({success: false, message: error.message})
//     }
// }
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order"; // Add this import
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const {address, items} = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({success: false, message: 'invalid data'});
        }

        // Fix the amount calculation
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

        // Create and save the order to MongoDB
        const totalAmount = amount + Math.floor(amount * 0.02);
        const newOrder = new Order({
            userId,
            address,
            items,
            amount: totalAmount,
            date: Date.now()
        });
        
        await newOrder.save();

        // Send the event to Inngest
        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: totalAmount,
                date: Date.now()
            }
        })

        //clear user cart
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({success: true, message: 'Order Placed'})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: error.message})
    }
}