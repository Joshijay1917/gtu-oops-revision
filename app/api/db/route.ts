import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import { Survey } from "../../../lib/models/Survey";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    const newSurvey = new Survey(body);
    await newSurvey.save();
    
    return NextResponse.json({ success: true, data: newSurvey }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to save survey:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
