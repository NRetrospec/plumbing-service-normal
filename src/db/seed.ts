import { db } from "./index";
import { users, appointments, estimates, invoices, inventory, reviews, blogPosts, referrals } from "./schema";
import { eq, sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("Checking if database needs seeding...");

    // Check if we already have users
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already has data. Skipping seeding.");
      return { message: "Database already seeded" };
    }

    console.log("Seeding database with premium demo data...");

    // 1. Seed Users (Admin, Technicians, Customers)
    const seededUsers = await db.insert(users).values([
      // Admin
      {
        name: "Marcus Sterling",
        email: "admin@flowmasters.com",
        password: "admin",
        role: "admin",
        phone: "(555) 123-4567",
        address: "100 Elite Business Way, Suite 400",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
      },
      // Technicians
      {
        name: "Dave Mercer",
        email: "dave@flowmasters.com",
        password: "tech",
        role: "technician",
        phone: "(555) 234-5678",
        address: "340 Pine Crest Dr",
        avatar: "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=200",
        rating: 4.9,
        specialty: "Sewer Repair & Hydro Jetting",
        isAvailable: true,
      },
      {
        name: "Alex Rivers",
        email: "alex@flowmasters.com",
        password: "tech",
        role: "technician",
        phone: "(555) 345-6789",
        address: "128 Cascade Blvd",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        rating: 4.8,
        specialty: "Water Heaters & Tankless Systems",
        isAvailable: true,
      },
      {
        name: "Carlos Mendez",
        email: "carlos@flowmasters.com",
        password: "tech",
        role: "technician",
        phone: "(555) 456-7890",
        address: "88 Silver Spring Way",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        rating: 4.95,
        specialty: "Leak Detection & Slab Repair",
        isAvailable: false, // currently on a call
      },
      {
        name: "Sarah Stone",
        email: "sarah@flowmasters.com",
        password: "tech",
        role: "technician",
        phone: "(555) 567-8901",
        address: "42 Golden Gate Ave",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        rating: 5.0,
        specialty: "Emergency Flow Controls",
        isAvailable: true,
      },
      // Customers
      {
        name: "Eleanor Vance",
        email: "customer@flowmasters.com",
        password: "customer",
        role: "customer",
        phone: "(555) 987-6543",
        address: "742 Evergreen Terrace, Springfield",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Robert Grayson",
        email: "robert.g@gmail.com",
        password: "password",
        role: "customer",
        phone: "(555) 876-5432",
        address: "910 Meadow Lane, Bellevue",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Sophia Chen",
        email: "sophia.chen@outlook.com",
        password: "password",
        role: "customer",
        phone: "(555) 765-4321",
        address: "1542 Summit Ave, Penthouse B",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      }
    ]).returning();

    const adminUser = seededUsers.find(u => u.role === "admin");
    const techDave = seededUsers.find(u => u.name === "Dave Mercer");
    const techAlex = seededUsers.find(u => u.name === "Alex Rivers");
    const techCarlos = seededUsers.find(u => u.name === "Carlos Mendez");
    const customerEleanor = seededUsers.find(u => u.email === "customer@flowmasters.com");
    const customerRobert = seededUsers.find(u => u.email === "robert.g@gmail.com");
    const customerSophia = seededUsers.find(u => u.email === "sophia.chen@outlook.com");

    // 2. Seed Inventory
    await db.insert(inventory).values([
      { itemName: "Copper Piping 1/2 inch (10ft)", category: "pipes", count: 85, minRequired: 20, unitPrice: "34.50", supplier: "Apex Pipe Supply" },
      { itemName: "PEX Piping 3/4 inch (100ft roll)", category: "pipes", count: 42, minRequired: 10, unitPrice: "115.00", supplier: "Apex Pipe Supply" },
      { itemName: "Brass Ball Valve 3/4 inch", category: "valves", count: 120, minRequired: 30, unitPrice: "24.99", supplier: "Global Valve Corp" },
      { itemName: "Pressure Reducing Valve (PRV)", category: "valves", count: 18, minRequired: 15, unitPrice: "89.50", supplier: "Global Valve Corp" },
      { itemName: "ProLine Tankless Gas Water Heater", category: "water_heaters", count: 8, minRequired: 5, unitPrice: "1250.00", supplier: "A.O. Smith Distributor" },
      { itemName: "Premier 50-Gal Electric Water Heater", category: "water_heaters", count: 12, minRequired: 6, unitPrice: "850.00", supplier: "A.O. Smith Distributor" },
      { itemName: "Dual-Flush Toilet Assembly", category: "fixtures", count: 15, minRequired: 10, unitPrice: "220.00", supplier: "Kohler Wholesale" },
      { itemName: "Luxury Kitchen Pull-out Faucet", category: "fixtures", count: 24, minRequired: 8, unitPrice: "185.00", supplier: "Kohler Wholesale" },
      { itemName: "Hydro-Jetting Nozzle Set Pro", category: "tools", count: 4, minRequired: 2, unitPrice: "450.00", supplier: "Rigid Pro Tools" },
      { itemName: "Digital Slab Leak Acoustic Sensor", category: "tools", count: 3, minRequired: 2, unitPrice: "1800.00", supplier: "Rigid Pro Tools" },
      { itemName: "Wax Ring & T-Bolt Combo Kit", category: "fittings", count: 250, minRequired: 50, unitPrice: "8.50", supplier: "Fasteners Direct" },
      { itemName: "Teflon Thread Sealant Tape 5-pack", category: "fittings", count: 8, minRequired: 20, unitPrice: "4.99", supplier: "Fasteners Direct" }, // Triggering low inventory alert
    ]);

    // 3. Seed Appointments (Jobs)
    const appointmentsData = [
      // Completed Job 1
      {
        customerId: customerEleanor?.id || 6,
        technicianId: techAlex?.id || 3,
        serviceType: "Water Heater Installation",
        description: "Replace leaking 40-gal water heater with a brand new high-efficiency tankless system. Client requested same-day service.",
        urgency: "high",
        status: "completed",
        scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        durationHours: 3,
        address: "742 Evergreen Terrace, Springfield",
        price: "1850.00",
        paymentStatus: "paid",
        beforePhoto: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300",
        afterPhoto: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300",
        customerSignature: "Eleanor Vance Signature",
        notes: "Flawless installation. Removed old corroded heater. System tested and hot water running within 2.5 hours.",
        technicianNotes: "Used 1x Tankless Water Heater, 2x Brass Ball Valves, and 4ft Copper Piping.",
        laborHours: 3.5,
      },
      // Completed Job 2
      {
        customerId: customerRobert?.id || 7,
        technicianId: techDave?.id || 2,
        serviceType: "Drain Cleaning & Hydro Jetting",
        description: "Main sewer line backed up. Standing water in basement floor drain. High urgency.",
        urgency: "emergency",
        status: "completed",
        scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        durationHours: 2,
        address: "910 Meadow Lane, Bellevue",
        price: "450.00",
        paymentStatus: "paid",
        beforePhoto: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300",
        afterPhoto: "https://images.unsplash.com/photo-1542013936693-8848e574047a?auto=format&fit=crop&q=80&w=300",
        customerSignature: "Robert Grayson Signature",
        notes: "Cleared heavy root intrusion 45 feet down the main sewer line using the Pro Hydro-Jetting nozzle. Root inhibitor treatment applied.",
        technicianNotes: "Main line cleared. Shared video inspect with owner. Recommended annual clean.",
        laborHours: 2.0,
      },
      // In Progress Job
      {
        customerId: customerSophia?.id || 8,
        technicianId: techCarlos?.id || 4,
        serviceType: "Leak Detection & Pipe Repair",
        description: "Sub-slab leak suspected. Water meter spinning constantly and warm spots on laundry room concrete floor.",
        urgency: "emergency",
        status: "in_progress",
        scheduledAt: new Date(), // Today
        durationHours: 4,
        address: "1542 Summit Ave, Penthouse B",
        price: "1200.00",
        paymentStatus: "unpaid",
        beforePhoto: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300",
        afterPhoto: null,
        customerSignature: null,
        notes: "Arrived on site. Located thermal spot using acoustic sensors. Ready to break drywall/concrete to access the split pipe joint.",
        technicianNotes: "Acoustic detection complete. Pinpointed leak to laundry hot water feed loop.",
        laborHours: 1.5,
      },
      // Dispatched / Scheduled Emergency Job
      {
        customerId: customerEleanor?.id || 6,
        technicianId: techDave?.id || 2,
        serviceType: "Toilet & Faucet Emergency Repair",
        description: "Master bathroom toilet overflowed and shutoff valve is frozen. Water flowing onto hardwood floor.",
        urgency: "emergency",
        status: "dispatched",
        scheduledAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // In an hour
        durationHours: 1,
        address: "742 Evergreen Terrace, Springfield",
        price: "320.00",
        paymentStatus: "unpaid",
        beforePhoto: null,
        afterPhoto: null,
        customerSignature: null,
        notes: "Urgent emergency response. Dispatching nearest technician Dave with high-volume pump.",
        technicianNotes: "En route. ETA 12 minutes.",
        laborHours: 0.0,
      },
      // Upcoming Pending Job
      {
        customerId: customerSophia?.id || 8,
        technicianId: null,
        serviceType: "Preventative Maintenance & Inspection",
        description: "Annual plumbing audit, pressure check, and water softener water hardness testing.",
        urgency: "maintenance",
        status: "pending",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        durationHours: 2,
        address: "1542 Summit Ave, Penthouse B",
        price: "150.00",
        paymentStatus: "unpaid",
        beforePhoto: null,
        afterPhoto: null,
        customerSignature: null,
        notes: "Customer subscribed to Platinum Care Protection plan. Free inspection included.",
        technicianNotes: null,
        laborHours: 0.0,
      },
    ];

    const insertedAppointments = await db.insert(appointments).values(appointmentsData).returning();

    // 4. Seed Invoices for completed jobs
    const completedJob1 = insertedAppointments.find(a => a.serviceType === "Water Heater Installation");
    const completedJob2 = insertedAppointments.find(a => a.serviceType === "Drain Cleaning & Hydro Jetting");
    const inProgressJob = insertedAppointments.find(a => a.serviceType === "Leak Detection & Pipe Repair");

    await db.insert(invoices).values([
      {
        appointmentId: completedJob1?.id || 1,
        customerId: customerEleanor?.id || 6,
        amount: "1850.00",
        status: "paid",
        dueAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        appointmentId: completedJob2?.id || 2,
        customerId: customerRobert?.id || 7,
        amount: "450.00",
        status: "paid",
        dueAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        appointmentId: inProgressJob?.id || 3,
        customerId: customerSophia?.id || 8,
        amount: "1200.00",
        status: "unpaid",
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      }
    ]);

    // 5. Seed Estimates
    await db.insert(estimates).values([
      {
        customerId: customerEleanor?.id || 6,
        serviceType: "Water Softener & Filtration System",
        description: "Testing shows water is 15 GPG hard. Requesting quote for whole-house luxury filtration and saltless softener.",
        status: "pending",
        estimatedCostLow: "2200.00",
        estimatedCostHigh: "2850.00",
        photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300",
        aiExplanation: "Based on water analysis and residence layout, we recommend the FlowMaster AquaShield Pro Series. This includes a carbon pre-filter block, standard active media softener, and optional high-flow UV sterilizer. Low estimate covers basic bypass setup; high estimate covers custom copper manifold routing and premium reverse osmosis connection for kitchen.",
      },
      {
        customerId: customerSophia?.id || 8,
        serviceType: "Re-piping House",
        description: "Full modern PEX re-pipe of standard 2-bathroom duplex to replace rusted galvanized steel lines.",
        status: "approved",
        estimatedCostLow: "6500.00",
        estimatedCostHigh: "8200.00",
        photoUrl: null,
        aiExplanation: "Estimating for complete removal of existing galvanized steel and installation of high-durability color-coded PEX-A piping (blue cold / red hot) with a central home run brass manifold. Standard plaster drywall patching is included in high-end package. Scheduled for project kickoff next Monday.",
      }
    ]);

    // 6. Seed Reviews
    await db.insert(reviews).values([
      {
        customerId: customerEleanor?.id || 6,
        technicianId: techAlex?.id || 3,
        rating: 5,
        comment: "FlowMasters is outstanding! Alex replaced our failing water heater. He was punctual, wore boot covers, explained the tankless operation clearly, and left the utility closet cleaner than he found it. Worth every single penny!",
        isPublic: true,
      },
      {
        customerId: customerRobert?.id || 7,
        technicianId: techDave?.id || 2,
        rating: 5,
        comment: "True life-savers. Sewer was backing up late Tuesday night. Dave got here within 25 minutes of calling! Had the main sewer line fully cleaned and root-blocked. Highly recommend the hydro-jetting!",
        isPublic: true,
      },
      {
        customerId: customerSophia?.id || 8,
        technicianId: techCarlos?.id || 4,
        rating: 5,
        comment: "Excellent high-tech equipment. Carlos located a hidden water leak behind my bathroom marble tiles using thermal sound sensors, avoiding tearing up the whole wall. Brilliant work!",
        isPublic: true,
      }
    ]);

    // 7. Seed Blog Posts
    await db.insert(blogPosts).values([
      {
        title: "5 Signs You Have a Hidden Sub-Slab Plumbing Leak",
        slug: "signs-hidden-slab-leak",
        content: "A slab leak occurs when the water pipes running underneath your home's concrete foundation start to leak. If left undetected, they can cause massive foundation damage and cost tens of thousands in structural repairs. Here are the 5 critical warning signs to watch out for: 1) Unusually warm spots on your floors. 2) The sound of water running when all faucets are closed. 3) A sudden spike in your monthly water bill. 4) Cracks appearing in your walls or flooring. 5) Mildew or damp carpets without an obvious source. If you notice any of these signs, contact FlowMasters immediately for advanced acoustic leak detection.",
        excerpt: "Learn how to spot costly foundation pipe leaks before they cause massive structural damage to your luxury home.",
        category: "DIY & Educational",
        author: "Carlos Mendez, Master Leak Detective",
        readTime: "6 min read",
      },
      {
        title: "Tank vs. Tankless Water Heaters: The Ultimate Modern Comparison",
        slug: "tank-vs-tankless-water-heaters",
        content: "Are you trying to decide between a traditional storage tank heater and a modern tankless unit? Tankless water heaters, also known as on-demand water heaters, only heat water when you turn on a hot tap. This saves substantial energy (up to 34% compared to standard tanks) and provides an endless supply of hot water. Traditional tanks are cheaper upfront but have a lifespan of 10-12 years, whereas tankless systems last 20+ years and occupy zero floor space. For larger premium homes, a tankless manifold setup is the ultimate setup for zero hot water lag.",
        excerpt: "Compare energy efficiency, lifetimes, costs, and water flow capacities of modern tankless vs traditional hot water tanks.",
        category: "Buying Guides",
        author: "Alex Rivers, Heating Systems Director",
        readTime: "8 min read",
      },
      {
        title: "Spring Plumbing Checklist: Preventative Care for Homeowners",
        slug: "spring-plumbing-checklist-homeowners",
        content: "Spring is the perfect time to give your home's water distribution systems a comprehensive checkup. Winter freezing and pipe expansion can stress joints and seals. Follow our professional guide: 1) Check hose bibbs for ice split damages by turning them on and blocking the mouth with your thumb. 2) Inspect your water heater's pressure relief valve and flush sediment build-up. 3) Run water in rarely used drains to fill trap seals and block sewer gas. 4) Check toilet fill and flush valves for silent leaks using a few drops of food coloring in the tank. If the water color seeps into the bowl without flushing, you have a leak!",
        excerpt: "Prevent major home water damages with our simple, certified spring plumbing maintenance routine.",
        category: "Seasonal Maintenance",
        author: "Dave Mercer, Operations Lead",
        readTime: "5 min read",
      }
    ]);

    // 8. Seed Referrals
    await db.insert(referrals).values([
      {
        referrerId: customerEleanor?.id || 6,
        refereeName: "Gregory Vance",
        status: "completed",
        rewardAmount: "50.00",
      },
      {
        referrerId: customerEleanor?.id || 6,
        refereeName: "Clara Templeton",
        status: "pending",
        rewardAmount: "50.00",
      }
    ]);

    console.log("Seeding finished successfully!");
    return { message: "Database seeded successfully!" };
  } catch (error) {
    console.error("Failed to seed database:", error);
    return { message: "Seeding failed", error };
  }
}
