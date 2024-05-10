import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
try {
  console.log("Seeding genders...");
  const data =await prisma.genders.createMany({
    data: [
      {
        name: "Masculino",
      },
      {
        name: "Femenino",
      },
    ],
  });
  console.log(data)
  
} catch (e) {
  console.log("Fatal error", e);
}