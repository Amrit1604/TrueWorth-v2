import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Visitor from "@/lib/models/visitor.model";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    await connectToDB();

    // Update or create visitor
    await Visitor.findOneAndUpdate(
      { sessionId },
      { lastSeen: new Date(), isActive: true },
      { upsert: true, new: true }
    );

    // Count active visitors (last seen within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeCount = await Visitor.countDocuments({
      lastSeen: { $gte: fiveMinutesAgo },
    });

    return NextResponse.json({ count: activeCount });
  } catch (error) {
    console.error("Visitor tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB();

    // Count active visitors (last seen within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeCount = await Visitor.countDocuments({
      lastSeen: { $gte: fiveMinutesAgo },
    });

    return NextResponse.json({ count: activeCount });
  } catch (error) {
    console.error("Get visitors error:", error);
    return NextResponse.json(
      { error: "Failed to get visitor count" },
      { status: 500 }
    );
  }
}
