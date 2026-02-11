-- CreateTable
CREATE TABLE "AuthenticationUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "details" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "AuthenticationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "praposalAccepted" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "details" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "praposalAccepted_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "praposalAccepted" ADD CONSTRAINT "praposalAccepted_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AuthenticationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
