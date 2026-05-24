import mongoose from "mongoose";

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

export const Survey = mongoose.models.Survey || mongoose.model("Survey", SurveySchema);
