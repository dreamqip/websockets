CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- CreateEnum
CREATE TYPE "Sensor" AS ENUM ('Accelerometer', 'Gyroscope', 'Magnetometer');

-- CreateTable
CREATE TABLE "SensorReading" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "sensor" "Sensor" NOT NULL,
    "xAxis" DOUBLE PRECISION NOT NULL,
    "yAxis" DOUBLE PRECISION NOT NULL,
    "zAxis" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destroyedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "publicKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SensorReading_id_created_at_key" ON "SensorReading"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SensorReading" ADD CONSTRAINT "SensorReading_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

SELECT create_hypertable('"SensorReading"', 'created_at', chunk_time_interval => INTERVAL '1 day');