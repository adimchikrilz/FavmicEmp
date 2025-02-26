// app/api/fix-db/route.js
import connectDB from "@/config/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    // Drop the clerkId index
    await mongoose.connection.db.collection('users').dropIndex("clerkId_1");
    
    return NextResponse.json({ 
      success: true,
      message: "clerkId index removed successfully" 
    });
  } catch (error) {
    console.error('Fix DB error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}