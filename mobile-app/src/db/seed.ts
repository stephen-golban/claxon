import { claxonTemplates, db } from "./index";

const sampleTemplates = [
  {
    category: "parking",
    messageEn: "Please move your car, you are blocking the exit",
    messageRo: "Vă rog să mutați mașina, blocați ieșirea",
    messageRu: "Пожалуйста, уберите машину, вы блокируете выезд",
    icon: "🚗",
  },
  {
    category: "lights",
    messageEn: "Your headlights are on",
    messageRo: "Aveți farurile aprinse",
    messageRu: "У вас включены фары",
    icon: "💡",
  },
  {
    category: "emergency",
    messageEn: "There is an emergency situation with your vehicle",
    messageRo: "Există o situație de urgență cu vehiculul dumneavoastră",
    messageRu: "С вашим автомобилем экстренная ситуация",
    icon: "🚨",
  },
  {
    category: "compliment",
    messageEn: "Nice car!",
    messageRo: "Mașină frumoasă!",
    messageRu: "Красивая машина!",
    icon: "👍",
  },
];

export async function seedDatabase() {
  console.log("Seeding database with sample templates...");

  try {
    // Check if templates already exist
    const existingTemplates = await db.select().from(claxonTemplates);

    if (existingTemplates.length > 0) {
      console.log("📋 Templates already exist, skipping seed...");
      return;
    }

    // Insert templates one by one with explicit IDs
    for (const template of sampleTemplates) {
      await db.insert(claxonTemplates).values({
        ...template,
        id: crypto.randomUUID(),
      });
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}
