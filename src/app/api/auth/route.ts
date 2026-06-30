import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, address, role } = body;

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
      }

      // Check database
      const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
      const user = foundUsers[0];

      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }

      if (user.password !== password) {
        return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          rating: user.rating,
          specialty: user.specialty,
        }
      });
    }

    if (action === "signup") {
      if (!email || !password || !name) {
        return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
      }

      // Check if email already exists
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing.length > 0) {
        return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
      }

      // Create user
      const inserted = await db.insert(users).values({
        name,
        email,
        password,
        role: role || "customer",
        phone: phone || "",
        address: address || "",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      }).returning();

      return NextResponse.json({
        success: true,
        message: "Registration successful",
        user: inserted[0]
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ success: false, error: error?.message || error }, { status: 500 });
  }
}
