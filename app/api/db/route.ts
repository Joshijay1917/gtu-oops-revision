import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../lib/mongodb";

const SurveySchema = new mongoose.Schema(
  {
    needCOAWebsite: { type: Boolean, default: null },
    needMobileApp: { type: Boolean, default: null },
    device: { type: String, default: null },
    helpProvideMaterial: { type: Boolean, default: null },
    branch: { type: String, default: null },
    provideBranchMaterial: { type: Boolean, default: null },
    email: { type: String, default: null },
  },
  { timestamps: true }
);

const Survey = mongoose.models.Survey || mongoose.model("Survey", SurveySchema);

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
