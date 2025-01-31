/*
  Warnings:

  - The `is_processor` column on the `AuthUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_addr` column on the `AuthUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_active` column on the `AuthUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rol` column on the `AuthUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `id_coordination_id` on the `Bienes` table. All the data in the column will be lost.
  - The `estado_colos` column on the `Bienes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipo_bien` column on the `Bienes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `leido` column on the `CreeWetPodificacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `autorizado` column on the `CreeWetPodificacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `id_coordination_id` on the `Vigilantes` table. All the data in the column will be lost.
  - The `hora_entrada` column on the `Vigilantes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hora_salida` column on the `Vigilantes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ficha_retorno` column on the `Vigilantes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CrearCoordinacion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `AuthUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_inventario]` on the table `Bienes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial]` on the table `Bienes` will be added. If there are existing duplicate values, this will fail.
  - Made the column `numero_inventario` on table `Bienes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre_ben` on table `Bienes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `CreeWetPodificacion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ficha_creador` on table `CreeWetPodificacion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `CreeWetPodificacion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numero_inventario` on table `Vigilantes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre_ben` on table `Vigilantes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `destino_ben` on table `Vigilantes` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('admin', 'editor', 'usuario');

-- CreateEnum
CREATE TYPE "TipoBien" AS ENUM ('facturacion', 'transitorio', 'regular');

-- CreateEnum
CREATE TYPE "EstadoColos" AS ENUM ('activo', 'inactivo', 'mantenimiento');

-- DropForeignKey
ALTER TABLE "Bienes" DROP CONSTRAINT "Bienes_id_coordination_id_fkey";

-- DropForeignKey
ALTER TABLE "CreeWetPodificacion" DROP CONSTRAINT "CreeWetPodificacion_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Vigilantes" DROP CONSTRAINT "Vigilantes_id_coordination_id_fkey";

-- AlterTable
ALTER TABLE "AuthUser" DROP COLUMN "is_processor",
ADD COLUMN     "is_processor" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "is_addr",
ADD COLUMN     "is_addr" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "rol",
ADD COLUMN     "rol" "Rol" NOT NULL DEFAULT 'usuario';

-- AlterTable
ALTER TABLE "Bienes" DROP COLUMN "id_coordination_id",
ADD COLUMN     "id_coordinacion" INTEGER,
ALTER COLUMN "numero_inventario" SET NOT NULL,
ALTER COLUMN "nombre_ben" SET NOT NULL,
ALTER COLUMN "caracteristica" SET DATA TYPE TEXT,
DROP COLUMN "estado_colos",
ADD COLUMN     "estado_colos" "EstadoColos" DEFAULT 'activo',
ALTER COLUMN "foto1" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "foto2" SET DATA TYPE VARCHAR(255),
DROP COLUMN "tipo_bien",
ADD COLUMN     "tipo_bien" "TipoBien" NOT NULL DEFAULT 'regular';

-- AlterTable
ALTER TABLE "CreeWetPodificacion" ALTER COLUMN "message" SET NOT NULL,
DROP COLUMN "leido",
ADD COLUMN     "leido" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "ficha_creador" SET NOT NULL,
ALTER COLUMN "ficha_creador" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "autorizado",
ADD COLUMN     "autorizado" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "usuario_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vigilantes" DROP COLUMN "id_coordination_id",
ADD COLUMN     "id_coordinacion" INTEGER,
ALTER COLUMN "numero_inventario" SET NOT NULL,
ALTER COLUMN "nombre_ben" SET NOT NULL,
ALTER COLUMN "destino_ben" SET NOT NULL,
DROP COLUMN "hora_entrada",
ADD COLUMN     "hora_entrada" TIME(6),
DROP COLUMN "hora_salida",
ADD COLUMN     "hora_salida" TIME(6),
DROP COLUMN "ficha_retorno",
ADD COLUMN     "ficha_retorno" TIMESTAMP(6),
ALTER COLUMN "foto1" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "foto2" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "CrearCoordinacion";

-- CreateTable
CREATE TABLE "Coordinacion" (
    "id_coordinacion" SERIAL NOT NULL,
    "codigo" VARCHAR(45) NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "descripcion" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Coordinacion_pkey" PRIMARY KEY ("id_coordinacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coordinacion_codigo_key" ON "Coordinacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bienes_numero_inventario_key" ON "Bienes"("numero_inventario");

-- CreateIndex
CREATE UNIQUE INDEX "Bienes_serial_key" ON "Bienes"("serial");

-- AddForeignKey
ALTER TABLE "Coordinacion" ADD CONSTRAINT "Coordinacion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bienes" ADD CONSTRAINT "Bienes_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "Coordinacion"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreeWetPodificacion" ADD CONSTRAINT "CreeWetPodificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vigilantes" ADD CONSTRAINT "Vigilantes_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "Coordinacion"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;
