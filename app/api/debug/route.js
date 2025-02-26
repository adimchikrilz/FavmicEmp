import connectDB from "@/config/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    // Direct database query to see what's in a user document
    const user = await mongoose.connection.db.collection('users').findOne();
    
    // Check for indexes to see if there's a clerkId index
    const indexes = await mongoose.connection.db.collection('users').indexes();
    
    // Get collection info
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    return NextResponse.json({ 
      user, 
      indexes,
      collections,
      message: "Debug info retrieved successfully" 
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}