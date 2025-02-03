/*
  Warnings:

  - You are about to drop the column `nombre` on the `bienes_transitorio` table. All the data in the column will be lost.
  - You are about to drop the `bienes_facturacion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numero_inventario]` on the table `bienes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_inventario]` on the table `bienes_transitorio` will be added. If there are existing duplicate values, this will fail.
  - Made the column `numero_inventario` on table `bienes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numero_inventario` on table `bienes_transitorio` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bienes_facturacion" DROP CONSTRAINT "bienes_facturacion_id_coordinacion_fkey";

-- AlterTable
ALTER TABLE "bienes" ADD COLUMN     "nombre_empleado" VARCHAR(100),
ALTER COLUMN "numero_inventario" SET NOT NULL;

-- AlterTable
ALTER TABLE "bienes_transitorio" DROP COLUMN "nombre",
ADD COLUMN     "nombre_bien" VARCHAR(100),
ADD COLUMN     "nombre_empleado" VARCHAR(100),
ALTER COLUMN "numero_inventario" SET NOT NULL;

-- DropTable
DROP TABLE "bienes_facturacion";

-- CreateIndex
CREATE UNIQUE INDEX "bienes_numero_inventario_key" ON "bienes"("numero_inventario");

-- CreateIndex
CREATE UNIQUE INDEX "bienes_transitorio_numero_inventario_key" ON "bienes_transitorio"("numero_inventario");
