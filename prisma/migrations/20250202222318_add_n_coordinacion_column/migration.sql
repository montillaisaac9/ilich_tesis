/*
  Warnings:

  - You are about to alter the column `tipo_operacion` on the `notificaciones` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `descripcion` on the `notificaciones` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `estado` on the `notificaciones` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(15)`.
  - Made the column `tipo_operacion` on table `notificaciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descripcion` on table `notificaciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_notificacion` on table `notificaciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estado` on table `notificaciones` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notificaciones" DROP CONSTRAINT "notificaciones_id_coordinacion_destino_fkey";

-- DropForeignKey
ALTER TABLE "notificaciones" DROP CONSTRAINT "notificaciones_id_coordinacion_origen_fkey";

-- AlterTable
ALTER TABLE "notificaciones" ADD COLUMN     "id_usuario" INTEGER,
ALTER COLUMN "tipo_operacion" SET NOT NULL,
ALTER COLUMN "tipo_operacion" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "descripcion" SET NOT NULL,
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "fecha_notificacion" SET NOT NULL,
ALTER COLUMN "fecha_notificacion" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "estado" SET NOT NULL,
ALTER COLUMN "estado" DROP DEFAULT,
ALTER COLUMN "estado" SET DATA TYPE VARCHAR(15);

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_coordinacion_origen_fkey" FOREIGN KEY ("id_coordinacion_origen") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_coordinacion_destino_fkey" FOREIGN KEY ("id_coordinacion_destino") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
