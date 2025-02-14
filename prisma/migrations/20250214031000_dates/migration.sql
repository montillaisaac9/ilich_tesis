/*
  Warnings:

  - The `fecha_ingreso` column on the `bienes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bienes" DROP COLUMN "fecha_ingreso",
ADD COLUMN     "fecha_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
