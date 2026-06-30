import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    return NextResponse.json({ success: true, reviews: list });
  } catch (error: any) {
    console.error("Get Reviews Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, technicianId, rating, comment } = body;

    if (!customerId || !rating || !comment) {
      return NextResponse.json({ success: false, message: "Missing feedback criteria" }, { status: 400 });
    }

    const inserted = await db.insert(reviews).values({
      customerId: parseInt(customerId),
      technicianId: technicianId ? parseInt(technicianId) : null,
      rating: parseInt(rating),
      comment,
      isPublic: true,
    }).returning();

    // Recalculate technician's average rating
    if (technicianId) {
      const techReviews = await db.select().from(reviews).where(eq(reviews.technicianId, parseInt(technicianId)));
      if (techReviews.length > 0) {
        const sum = techReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avg = sum / techReviews.length;
        await db.update(users).set({ rating: avg }).where(eq(users.id, parseInt(technicianId)));
      }
    }

    return NextResponse.json({ success: true, review: inserted[0] });
  } catch (error: any) {
    console.error("Create Review Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}
