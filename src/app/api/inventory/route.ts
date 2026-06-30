import { NextResponse } from "next/server";
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(inventory).orderBy(inventory.itemName);
    return NextResponse.json({ success: true, inventory: list });
  } catch (error: any) {
    console.error("Get Inventory Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, itemId, amount, itemName, category, count, minRequired, unitPrice, supplier } = body;

    if (action === "adjust-stock" && itemId && amount !== undefined) {
      const current = await db.select().from(inventory).where(eq(inventory.id, parseInt(itemId))).limit(1);
      if (current.length === 0) {
        return NextResponse.json({ success: false, message: "Inventory item not found" }, { status: 404 });
      }

      const newCount = Math.max(0, current[0].count + parseInt(amount));
      const updated = await db.update(inventory)
        .set({ count: newCount })
        .where(eq(inventory.id, parseInt(itemId)))
        .returning();

      return NextResponse.json({ success: true, item: updated[0] });
    }

    if (action === "create") {
      if (!itemName || !category || count === undefined || !unitPrice) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
      }

      const inserted = await db.insert(inventory).values({
        itemName,
        category,
        count: parseInt(count),
        minRequired: parseInt(minRequired || "10"),
        unitPrice,
        supplier: supplier || "Direct Supply"
      }).returning();

      return NextResponse.json({ success: true, item: inserted[0] });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Inventory Action Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}
