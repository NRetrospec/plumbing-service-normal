import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, invoices, inventory, users, estimates } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // 1. Calculate Revenue (paid invoices sum)
    const paidInvoices = await db.select({
      sum: sql<string>`sum(cast(${invoices.amount} as numeric))`
    }).from(invoices).where(eq(invoices.status, "paid"));
    const totalRevenue = parseFloat(paidInvoices[0]?.sum || "0.00");

    // 2. Calculate Unpaid/Outstanding invoices
    const unpaidInvoices = await db.select({
      sum: sql<string>`sum(cast(${invoices.amount} as numeric))`
    }).from(invoices).where(eq(invoices.status, "unpaid"));
    const outstandingRevenue = parseFloat(unpaidInvoices[0]?.sum || "0.00");

    // 3. Count Jobs
    const allJobs = await db.select().from(appointments);
    const totalJobs = allJobs.length;
    const completedJobs = allJobs.filter(j => j.status === "completed").length;
    const activeJobs = allJobs.filter(j => ["scheduled", "dispatched", "in_progress"].includes(j.status)).length;
    const pendingJobs = allJobs.filter(j => j.status === "pending").length;

    // 4. Low stock inventory items
    const allInventory = await db.select().from(inventory);
    const lowStockItems = allInventory.filter(item => item.count < item.minRequired);

    // 5. Technicians list
    const techniciansList = await db.select().from(users).where(eq(users.role, "technician"));

    // 6. Customers list
    const customersList = await db.select().from(users).where(eq(users.role, "customer"));

    // 7. Estimates list
    const allEstimates = await db.select().from(estimates);

    // 8. Calculate Average Ticket Value
    const completedWithPrices = allJobs.filter(j => j.status === "completed" && j.price && parseFloat(j.price) > 0);
    const avgTicket = completedWithPrices.length > 0 
      ? completedWithPrices.reduce((acc, job) => acc + parseFloat(job.price || "0"), 0) / completedWithPrices.length 
      : 250;

    // 9. Lead conversion rate simulation
    // Let's assume approved estimates / total estimates is lead conversion
    const totalEst = allEstimates.length;
    const approvedEst = allEstimates.filter(e => e.status === "approved").length;
    const conversionRate = totalEst > 0 ? Math.round((approvedEst / totalEst) * 100) : 65;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        outstandingRevenue,
        totalJobs,
        completedJobs,
        activeJobs,
        pendingJobs,
        lowStockCount: lowStockItems.length,
        technicianCount: techniciansList.length,
        customerCount: customersList.length,
        averageTicketValue: Math.round(avgTicket),
        conversionRate,
        lowStockItems: lowStockItems.slice(0, 5),
        technicians: techniciansList.map(t => ({ id: t.id, name: t.name, specialty: t.specialty, isAvailable: t.isAvailable, rating: t.rating })),
      }
    });
  } catch (error: any) {
    console.error("Get Admin Stats Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}
