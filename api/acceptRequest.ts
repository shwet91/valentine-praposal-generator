import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const record = await prisma.user.update({
      where: { id: userId },
      data: {
        requestAccepted: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error recording proposal acceptance:", error);
    return res.status(500).json({ error: "Failed to record acceptance" });
  }
}
