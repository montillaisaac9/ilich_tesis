/*
  Warnings:

  - You are about to drop the `AuthGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthUserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthUserPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BienesFacturacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BienesTransitorios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuaries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthUserGroup" DROP CONSTRAINT "AuthUserGroup_group_id_fkey";

-- DropForeignKey
ALTER TABLE "AuthUserGroup" DROP CONSTRAINT "AuthUserGroup_user_id_fkey";

-- DropForeignKey
ALTER TABLE "AuthUserPermission" DROP CONSTRAINT "AuthUserPermission_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CreeWetPodificacion" DROP CONSTRAINT "CreeWetPodificacion_usuario_id_fkey";

-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "rol" VARCHAR(50);

-- AlterTable
ALTER TABLE "Bienes" ADD COLUMN     "tipo_bien" VARCHAR(50);

-- AlterTable
ALTER TABLE "CreeWetPodificacion" ALTER COLUMN "usuario_id" DROP NOT NULL;

-- DropTable
DROP TABLE "AuthGroup";

-- DropTable
DROP TABLE "AuthUserGroup";

-- DropTable
DROP TABLE "AuthUserPermission";

-- DropTable
DROP TABLE "BienesFacturacion";

-- DropTable
DROP TABLE "BienesTransitorios";

-- DropTable
DROP TABLE "Usuaries";

-- AddForeignKey
ALTER TABLE "Bienes" ADD CONSTRAINT "Bienes_id_coordination_id_fkey" FOREIGN KEY ("id_coordination_id") REFERENCES "CrearCoordinacion"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreeWetPodificacion" ADD CONSTRAINT "CreeWetPodificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vigilantes" ADD CONSTRAINT "Vigilantes_id_coordination_id_fkey" FOREIGN KEY ("id_coordination_id") REFERENCES "CrearCoordinacion"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;
