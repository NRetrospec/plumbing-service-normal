import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, users, inventory } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerIdStr = searchParams.get("customerId");
    const technicianIdStr = searchParams.get("technicianId");
    const idStr = searchParams.get("id");

    if (idStr) {
      const result = await db.select().from(appointments).where(eq(appointments.id, parseInt(idStr))).limit(1);
      return NextResponse.json({ success: true, appointment: result[0] || null });
    }

    let query = db.select().from(appointments);
    
    // Build query filters manually
    if (customerIdStr) {
      const list = await db.select().from(appointments).where(eq(appointments.customerId, parseInt(customerIdStr))).orderBy(desc(appointments.scheduledAt));
      return NextResponse.json({ success: true, appointments: list });
    }

    if (technicianIdStr) {
      const list = await db.select().from(appointments).where(eq(appointments.technicianId, parseInt(technicianIdStr))).orderBy(desc(appointments.scheduledAt));
      return NextResponse.json({ success: true, appointments: list });
    }

    // Default: admin list
    const list = await db.select().from(appointments).orderBy(desc(appointments.scheduledAt));
    return NextResponse.json({ success: true, appointments: list });
  } catch (error: any) {
    console.error("Get Bookings Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, serviceType, description, urgency, scheduledAt, address, price, technicianId } = body;

    if (!customerId || !serviceType || !description || !scheduledAt || !address) {
      return NextResponse.json({ success: false, message: "Missing required booking details" }, { status: 400 });
    }

    // Auto-assignment for Emergency priority if technician is available
    let assignedTechId = technicianId ? parseInt(technicianId) : null;
    let initialStatus = "pending";

    if (!assignedTechId && (urgency === "emergency" || urgency === "high")) {
      // Find an available technician
      const availableTechs = await db.select().from(users).where(and(eq(users.role, "technician"), eq(users.isAvailable, true))).limit(1);
      if (availableTechs.length > 0) {
        assignedTechId = availableTechs[0].id;
        initialStatus = "dispatched"; // instantly dispatched
        
        // Mark technician as unavailable
        await db.update(users).set({ isAvailable: false }).where(eq(users.id, assignedTechId));
      }
    }

    const inserted = await db.insert(appointments).values({
      customerId: parseInt(customerId),
      technicianId: assignedTechId,
      serviceType,
      description,
      urgency: urgency || "standard",
      status: initialStatus,
      scheduledAt: new Date(scheduledAt),
      address,
      price: price || "0.00",
      paymentStatus: "unpaid",
      notes: urgency === "emergency" ? "Emergency priority request. Dispatched instantly." : "Standard online booking.",
    }).returning();

    return NextResponse.json({ success: true, appointment: inserted[0] });
  } catch (error: any) {
    console.error("Create Booking Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      appointmentId, 
      status, 
      technicianId, 
      price, 
      paymentStatus, 
      beforePhoto, 
      afterPhoto, 
      customerSignature, 
      notes, 
      technicianNotes, 
      laborHours 
    } = body;

    if (!appointmentId) {
      return NextResponse.json({ success: false, message: "Appointment ID is required" }, { status: 400 });
    }

    const currentArr = await db.select().from(appointments).where(eq(appointments.id, parseInt(appointmentId))).limit(1);
    const current = currentArr[0];
    if (!current) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 444 });
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (technicianId !== undefined) updateFields.technicianId = technicianId ? parseInt(technicianId) : null;
    if (price !== undefined) updateFields.price = price;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (beforePhoto !== undefined) updateFields.beforePhoto = beforePhoto;
    if (afterPhoto !== undefined) updateFields.afterPhoto = afterPhoto;
    if (customerSignature !== undefined) updateFields.customerSignature = customerSignature;
    if (notes !== undefined) updateFields.notes = notes;
    if (technicianNotes !== undefined) updateFields.technicianNotes = technicianNotes;
    if (laborHours !== undefined) updateFields.laborHours = parseFloat(laborHours);

    // If status changed to completed, release technician
    if (status === "completed" && current.technicianId) {
      await db.update(users).set({ isAvailable: true }).where(eq(users.id, current.technicianId));
    }

    // If technician is newly assigned, mark them unavailable
    if (technicianId && current.technicianId !== parseInt(technicianId)) {
      await db.update(users).set({ isAvailable: false }).where(eq(users.id, parseInt(technicianId)));
    }

    const updated = await db.update(appointments).set(updateFields).where(eq(appointments.id, parseInt(appointmentId))).returning();

    return NextResponse.json({ success: true, appointment: updated[0] });
  } catch (error: any) {
    console.error("Update Booking Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}
