import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, gender } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!gender || typeof gender !== "string" || !gender.trim()) {
      return res.status(400).json({ error: "Gender is required" });
    }



    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        gender: gender.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      user: {
        userId: user.id,
        name: user.name,
        gender: user.gender,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
}
