import { seedDatabase } from "./seed";

async function main() {
  console.log("Starting seeding process via CLI...");
  const result = await seedDatabase();
  console.log("Seeding process result:", result);
  process.exit(0);
}

main().catch(err => {
  console.error("Seeding runner failed:", err);
  process.exit(1);
});
