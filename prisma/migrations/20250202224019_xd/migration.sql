/*
  Warnings:

  - You are about to drop the column `id_usuario` on the `notificaciones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notificaciones" DROP CONSTRAINT "notificaciones_id_usuario_fkey";

-- AlterTable
ALTER TABLE "notificaciones" DROP COLUMN "id_usuario";
