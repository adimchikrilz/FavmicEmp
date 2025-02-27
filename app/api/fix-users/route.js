// app/api/fix-users/route.js
import connectDB from "@/config/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    // Update all existing users to set clerkId equal to _id
    const result = await mongoose.connection.db.collection('users')
      .updateMany(
        { clerkId: { $exists: false } }, // Where clerkId doesn't exist
        [{ $set: { clerkId: "$_id" } }]  // Set clerkId to the value of _id
      );
    
    return NextResponse.json({ 
      success: true,
      message: "Users updated successfully",
      result
    });
  } catch (error) {
    console.error('Fix users error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}