/*
  Warnings:

  - You are about to drop the `Bienes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BienesFacturacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BienesTransitorio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coordinaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notificaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vigilantes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bienes" DROP CONSTRAINT "Bienes_id_coordinacion_fkey";

-- DropForeignKey
ALTER TABLE "BienesFacturacion" DROP CONSTRAINT "BienesFacturacion_id_coordinacion_fkey";

-- DropForeignKey
ALTER TABLE "BienesTransitorio" DROP CONSTRAINT "BienesTransitorio_id_coordinacion_fkey";

-- DropForeignKey
ALTER TABLE "Notificaciones" DROP CONSTRAINT "Notificaciones_id_coordinacion_destino_fkey";

-- DropForeignKey
ALTER TABLE "Notificaciones" DROP CONSTRAINT "Notificaciones_id_coordinacion_origen_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_id_coordinacion_fkey";

-- DropForeignKey
ALTER TABLE "Vigilantes" DROP CONSTRAINT "Vigilantes_id_coordinacion_fkey";

-- DropTable
DROP TABLE "Bienes";

-- DropTable
DROP TABLE "BienesFacturacion";

-- DropTable
DROP TABLE "BienesTransitorio";

-- DropTable
DROP TABLE "Coordinaciones";

-- DropTable
DROP TABLE "Notificaciones";

-- DropTable
DROP TABLE "Usuarios";

-- DropTable
DROP TABLE "Vigilantes";

-- CreateTable
CREATE TABLE "bienes" (
    "id_bienes" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre_bien" VARCHAR(100),
    "marca" VARCHAR(100),
    "modelo" VARCHAR(100),
    "serial" VARCHAR(100),
    "caracteristicas" VARCHAR(100),
    "codigo_color" VARCHAR(45),
    "color_ubica_imnuebe" VARCHAR(100),
    "estado_bien" VARCHAR(15),
    "foto1" VARCHAR(100),
    "foto2" VARCHAR(100),
    "id_coordinacion" INTEGER,

    CONSTRAINT "bienes_pkey" PRIMARY KEY ("id_bienes")
);

-- CreateTable
CREATE TABLE "bienes_facturacion" (
    "id_facturacion" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre" VARCHAR(100),
    "marca" VARCHAR(100),
    "modelo" VARCHAR(100),
    "serial" VARCHAR(100),
    "color" VARCHAR(100),
    "direccion" VARCHAR(100),
    "fecha_ingreso" VARCHAR(45),
    "foto1" VARCHAR(100),
    "foto2" VARCHAR(100),
    "id_coordinacion" INTEGER,

    CONSTRAINT "bienes_facturacion_pkey" PRIMARY KEY ("id_facturacion")
);

-- CreateTable
CREATE TABLE "bienes_transitorio" (
    "id_transitorio" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre" VARCHAR(100),
    "fecha_ingreso" VARCHAR(45),
    "foto" VARCHAR(100),
    "id_coordinacion" INTEGER,

    CONSTRAINT "bienes_transitorio_pkey" PRIMARY KEY ("id_transitorio")
);

-- CreateTable
CREATE TABLE "coordinaciones" (
    "id_coordinacion" SERIAL NOT NULL,
    "nombre_coordinacion" VARCHAR(100) NOT NULL,

    CONSTRAINT "coordinaciones_pkey" PRIMARY KEY ("id_coordinacion")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "id_coordinacion_origen" INTEGER,
    "id_coordinacion_destino" INTEGER,
    "tipo_operacion" VARCHAR(50),
    "descripcion" TEXT,
    "fecha_notificacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(50) DEFAULT 'Pendiente',

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "contraseña" VARCHAR(100) NOT NULL,
    "palabra_seguridad" VARCHAR(100),
    "id_coordinacion" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "vigilantes" (
    "id_vigilante" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre_bien" VARCHAR(100),
    "destino_bien" VARCHAR(100),
    "hora_entrada" VARCHAR(45),
    "hora_salida" VARCHAR(45),
    "fecha_reformo" VARCHAR(100),
    "foto1" VARCHAR(100),
    "foto2" VARCHAR(100),
    "id_coordinacion" INTEGER,

    CONSTRAINT "vigilantes_pkey" PRIMARY KEY ("id_vigilante")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- AddForeignKey
ALTER TABLE "bienes" ADD CONSTRAINT "bienes_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bienes_facturacion" ADD CONSTRAINT "bienes_facturacion_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bienes_transitorio" ADD CONSTRAINT "bienes_transitorio_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_coordinacion_destino_fkey" FOREIGN KEY ("id_coordinacion_destino") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_coordinacion_origen_fkey" FOREIGN KEY ("id_coordinacion_origen") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vigilantes" ADD CONSTRAINT "vigilantes_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "coordinaciones"("id_coordinacion") ON DELETE NO ACTION ON UPDATE NO ACTION;
