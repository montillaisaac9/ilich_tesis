-- CreateTable
CREATE TABLE "Coordinaciones" (
    "id_coordinacion" SERIAL NOT NULL,
    "nombre_coordinacion" VARCHAR(100) NOT NULL,

    CONSTRAINT "Coordinaciones_pkey" PRIMARY KEY ("id_coordinacion")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "contraseña" VARCHAR(100) NOT NULL,
    "palabra_seguridad" VARCHAR(100),
    "id_coordinacion" INTEGER,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "BienesFacturacion" (
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

    CONSTRAINT "BienesFacturacion_pkey" PRIMARY KEY ("id_facturacion")
);

-- CreateTable
CREATE TABLE "BienesTransitorio" (
    "id_transitorio" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre" VARCHAR(100),
    "fecha_ingreso" VARCHAR(45),
    "foto" VARCHAR(100),
    "id_coordinacion" INTEGER,

    CONSTRAINT "BienesTransitorio_pkey" PRIMARY KEY ("id_transitorio")
);

-- CreateTable
CREATE TABLE "Vigilantes" (
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

    CONSTRAINT "Vigilantes_pkey" PRIMARY KEY ("id_vigilante")
);

-- CreateTable
CREATE TABLE "Bienes" (
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

    CONSTRAINT "Bienes_pkey" PRIMARY KEY ("id_bienes")
);

-- CreateTable
CREATE TABLE "Notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "id_coordinacion_origen" INTEGER NOT NULL,
    "id_coordinacion_destino" INTEGER NOT NULL,
    "tipo_operacion" VARCHAR(50),
    "descripcion" TEXT,
    "fecha_notificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(50) NOT NULL DEFAULT 'Pendiente',

    CONSTRAINT "Notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_username_key" ON "Usuarios"("username");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "Coordinaciones"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BienesFacturacion" ADD CONSTRAINT "BienesFacturacion_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "Coordinaciones"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BienesTransitorio" ADD CONSTRAINT "BienesTransitorio_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "Coordinaciones"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vigilantes" ADD CONSTRAINT "Vigilantes_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "Coordinaciones"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bienes" ADD CONSTRAINT "Bienes_id_coordinacion_fkey" FOREIGN KEY ("id_coordinacion") REFERENCES "Coordinaciones"("id_coordinacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "Notificaciones_id_coordinacion_origen_fkey" FOREIGN KEY ("id_coordinacion_origen") REFERENCES "Coordinaciones"("id_coordinacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "Notificaciones_id_coordinacion_destino_fkey" FOREIGN KEY ("id_coordinacion_destino") REFERENCES "Coordinaciones"("id_coordinacion") ON DELETE RESTRICT ON UPDATE CASCADE;
