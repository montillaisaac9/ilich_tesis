/*
  Warnings:

  - You are about to drop the column `codigo_color` on the `bienes` table. All the data in the column will be lost.
  - You are about to drop the column `color_ubica_imnuebe` on the `bienes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bienes" DROP COLUMN "codigo_color",
DROP COLUMN "color_ubica_imnuebe",
ADD COLUMN     "fecha_ingreso" VARCHAR(45);
