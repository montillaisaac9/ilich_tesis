/*
  Warnings:

  - You are about to drop the `bienes_transitorio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `number_coordinacion` to the `coordinaciones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bienes_transitorio" DROP CONSTRAINT "bienes_transitorio_id_coordinacion_fkey";

-- AlterTable
ALTER TABLE "bienes" ADD COLUMN     "codigo_color" VARCHAR(45),
ADD COLUMN     "tipo_bien" VARCHAR(15);

-- AlterTable
ALTER TABLE "coordinaciones" ADD COLUMN     "number_coordinacion" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "bienes_transitorio";
