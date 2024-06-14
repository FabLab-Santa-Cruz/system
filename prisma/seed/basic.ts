import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Genders migration
  try {
    console.log("Seeding genders...");

    // If there are no genders, seed them
    const genders = await prisma.genders.findMany();
    if (genders.length > 0) {
      console.log("Genders already exist. Skipping seeding...");
    }

    const data = await prisma.genders.createMany({
      data: [
        {
          name: "Masculino",
        },
        {
          name: "Femenino",
        },
      ],
    });
    console.log(data);
  } catch (e) {
    console.log("Fatal error", e);
  }
}

await main()