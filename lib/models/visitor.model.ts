import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Auto-expire visitors after 5 minutes of inactivity
visitorSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 300 });

const Visitor = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);

export default Visitor;
