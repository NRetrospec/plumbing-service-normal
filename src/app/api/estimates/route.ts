import { NextResponse } from "next/server";
import { db } from "@/db";
import { estimates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const PRICING_MATRIX: Record<string, { low: number; high: number; explanation: string }> = {
  "Emergency Plumbing": {
    low: 150,
    high: 450,
    explanation: "Emergency callout covers dispatch, diagnostic, and initial 1 hour of leak isolation. High-end covers night-time rates and specialized equipment isolation."
  },
  "Drain Cleaning": {
    low: 120,
    high: 350,
    explanation: "Covers motorized auger snaking. High-end applies to line lengths exceeding 75 feet or heavy root intrusions."
  },
  "Sewer Repair": {
    low: 1800,
    high: 6200,
    explanation: "Covers trenchless spot repair or partial excavation. Price varies heavily depending on depth of line and landscaping obstruction."
  },
  "Leak Detection": {
    low: 250,
    high: 650,
    explanation: "Includes high-precision electro-acoustic line tracing, moisture sensors, and thermal imaging to pinpoint slab/wall leaks."
  },
  "Water Heater Installation": {
    low: 950,
    high: 2100,
    explanation: "Includes 40-50 gal premier tank unit, new supply valves, gas flex connection, thermal expansion tank, and disposal of old unit."
  },
  "Tankless Water Heaters": {
    low: 1950,
    high: 3500,
    explanation: "Includes retrofitting standard tank to premium tankless, upgrading gas supply manifolds, scaling safety bypass valves, and smart electronic controls."
  },
  "Toilet Repair": {
    low: 95,
    high: 220,
    explanation: "Covers complete rebuild (fill valve, flapper, tank-to-bowl gasket) or standard wax ring reset to solve floor dampness."
  },
  "Water Filtration Systems": {
    low: 800,
    high: 2500,
    explanation: "Covers whole-house dual stage carbon filtration. High-end includes premium UV sanitization manifolds and dedicated pure drinking water lines."
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerIdStr = searchParams.get("customerId");

    if (customerIdStr) {
      const list = await db.select().from(estimates).where(eq(estimates.customerId, parseInt(customerIdStr))).orderBy(desc(estimates.createdAt));
      return NextResponse.json({ success: true, estimates: list });
    }

    const list = await db.select().from(estimates).orderBy(desc(estimates.createdAt));
    return NextResponse.json({ success: true, estimates: list });
  } catch (error: any) {
    console.error("Get Estimates Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, serviceType, description, photoUrl, action, estimateId, status } = body;

    // Handle approval workflow
    if (action === "update-status" && estimateId && status) {
      const updated = await db.update(estimates)
        .set({ status })
        .where(eq(estimates.id, parseInt(estimateId)))
        .returning();
      return NextResponse.json({ success: true, estimate: updated[0] });
    }

    if (!customerId || !serviceType || !description) {
      return NextResponse.json({ success: false, message: "Missing required estimate fields" }, { status: 400 });
    }

    // AI estimate calculation
    const match = PRICING_MATRIX[serviceType] || {
      low: 180,
      high: 550,
      explanation: "Standard plumbing assessment. Covers professional diagnostics, pipe connection checks, and initial repair components."
    };

    const isComplex = description.toLowerCase().includes("multiple") || description.toLowerCase().includes("burst") || description.toLowerCase().includes("commercial");
    const factor = isComplex ? 1.3 : 1.0;

    const lowEst = (match.low * factor).toFixed(2);
    const highEst = (match.high * factor).toFixed(2);

    const aiExplanation = `[FlowMaster AI Assistant Diagnostics] \n` +
      `Analyzing service type: "${serviceType}".\n` +
      `Keywords identified: "${description.substring(0, 40)}...".\n` +
      `Assessment: ${match.explanation}\n` +
      `Preliminary Recommendation: An expert technician should confirm the pipe diameters and local code compliance. We have pre-approved a local service window for this bracket.`;

    const inserted = await db.insert(estimates).values({
      customerId: parseInt(customerId),
      serviceType,
      description,
      status: "pending",
      estimatedCostLow: lowEst,
      estimatedCostHigh: highEst,
      photoUrl: photoUrl || "",
      aiExplanation,
    }).returning();

    return NextResponse.json({ success: true, estimate: inserted[0] });
  } catch (error: any) {
    console.error("Create Estimate Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}
