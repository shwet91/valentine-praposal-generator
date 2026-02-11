import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, gender } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
      });
    }

    if (!gender || typeof gender !== "string" || !gender.trim()) {
      return new Response(JSON.stringify({ error: "Gender is required" }), {
        status: 400,
      });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        gender: gender.trim(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          userId: user.id,
          name: user.name,
          gender: user.gender,
          createdAt: user.createdAt,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    console.error("Register error:", err);

    return new Response(JSON.stringify({ error: "Failed to register user" }), {
      status: 500,
    });
  }
}
