-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'COLLECTOR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT E'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "maps_link" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "collects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "collectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "item" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "collects_id_key" ON "collects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cards_id_key" ON "cards"("id");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_collectId_fkey" FOREIGN KEY ("collectId") REFERENCES "collects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
