/// app/api/db-fix/route.js
import connectDB from "@/config/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    // STEP 1: Check if problematic users exist
    const nullClerkIdUsers = await db.collection('users')
      .find({ clerkId: null })
      .toArray();
    
    console.log(`Found ${nullClerkIdUsers.length} users with null clerkId`);
    
    // STEP 2: If we have problematic users, delete them
    let deleteResult = null;
    if (nullClerkIdUsers.length > 0) {
      deleteResult = await db.collection('users')
        .deleteMany({ clerkId: null });
      console.log(`Deleted ${deleteResult.deletedCount} users with null clerkId`);
    }
    
    // STEP 3: Try to drop the problematic index
    let dropIndexResult = null;
    try {
      dropIndexResult = await db.collection('users').dropIndex("clerkId_1");
      console.log("Successfully dropped clerkId_1 index");
    } catch (indexError) {
      console.log("Error dropping index:", indexError.message);
    }
    
    // STEP 4: Check all existing users and make sure they have clerkId = _id
    const updateResult = await db.collection('users').updateMany(
      {}, // All documents
      [{ $set: { clerkId: "$_id" } }] // Set clerkId to _id
    );
    console.log(`Updated ${updateResult.modifiedCount} users to set clerkId = _id`);
    
    // STEP 5: Create a new sparse index if the old one was dropped
    let createIndexResult = null;
    if (dropIndexResult && dropIndexResult.ok) {
      try {
        createIndexResult = await db.collection('users').createIndex(
          { clerkId: 1 },
          { unique: true, sparse: true, background: true }
        );
        console.log("Created new sparse index for clerkId");
      } catch (createIndexError) {
        console.log("Error creating new index:", createIndexError.message);
      }
    }
    
    // Return comprehensive results
    return NextResponse.json({
      success: true,
      message: "Database fix operations completed",
      results: {
        nullClerkIdUsers: nullClerkIdUsers.length,
        deleteResult,
        dropIndexResult,
        updateResult,
        createIndexResult
      }
    });
  } catch (error) {
    console.error('Database fix error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}