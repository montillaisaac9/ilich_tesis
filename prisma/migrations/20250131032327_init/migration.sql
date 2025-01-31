-- CreateTable
CREATE TABLE "AuthUser" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "last_login" TIMESTAMP(6),
    "is_processor" SMALLINT,
    "username" VARCHAR(150) NOT NULL,
    "first_name" VARCHAR(156),
    "last_name" VARCHAR(159),
    "email" VARCHAR(254),
    "is_addr" SMALLINT,
    "is_active" SMALLINT,
    "date_ponse" TIMESTAMP(6),
    "palabras_seguridad" VARCHAR(50)[],

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthGroup" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(156) NOT NULL,

    CONSTRAINT "AuthGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthUserGroup" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "AuthUserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthUserPermission" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "AuthUserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuaries" (
    "usuario" INTEGER NOT NULL,
    "nombre_usuario" VARCHAR(100),
    "usuario_varchar" VARCHAR(15),
    "ficha_ingreso" VARCHAR(45),
    "dirino_ingreso" VARCHAR(45),
    "foto_central" VARCHAR(100),
    "list_login" TIMESTAMP(6),
    "password" VARCHAR(128),
    "clave_usuario" VARCHAR(100),

    CONSTRAINT "Usuaries_pkey" PRIMARY KEY ("usuario")
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
    "directory" VARCHAR(100),
    "ficha_ingreso" VARCHAR(45),
    "foto1" VARCHAR(100),
    "foto2" VARCHAR(100),
    "id_coordination_id" INTEGER,

    CONSTRAINT "BienesFacturacion_pkey" PRIMARY KEY ("id_facturacion")
);

-- CreateTable
CREATE TABLE "CreeWetPodificacion" (
    "id" BIGSERIAL NOT NULL,
    "message" TEXT,
    "leido" SMALLINT,
    "ficha_creador" TIMESTAMP(6),
    "autorizado" SMALLINT,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "CreeWetPodificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vigilantes" (
    "id_vigilante" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre_ben" VARCHAR(100),
    "destino_ben" VARCHAR(100),
    "hora_entrada" VARCHAR(45),
    "hora_salida" VARCHAR(45),
    "ficha_retorno" VARCHAR(100),
    "foto1" VARCHAR(100),
    "foto2" VARCHAR(100),
    "id_coordination_id" INTEGER,

    CONSTRAINT "Vigilantes_pkey" PRIMARY KEY ("id_vigilante")
);

-- CreateTable
CREATE TABLE "BienesTransitorios" (
    "id_transitorio" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre" VARCHAR(100),
    "ficha_ingreso" VARCHAR(45),
    "foto" VARCHAR(100),
    "id_coordination_id" INTEGER,

    CONSTRAINT "BienesTransitorios_pkey" PRIMARY KEY ("id_transitorio")
);

-- CreateTable
CREATE TABLE "CrearCoordinacion" (
    "id_coordinacion" SERIAL NOT NULL,
    "codigo" VARCHAR(45),
    "nombre" VARCHAR(45),
    "description" VARCHAR(45),

    CONSTRAINT "CrearCoordinacion_pkey" PRIMARY KEY ("id_coordinacion")
);

-- CreateTable
CREATE TABLE "Bienes" (
    "id_bienes" SERIAL NOT NULL,
    "numero_inventario" VARCHAR(100),
    "nombre_ben" VARCHAR(100),
    "marca" VARCHAR(100),
    "modelo" VARCHAR(100),
    "serial" VARCHAR(100),
    "caracteristica" VARCHAR(100),
    "codigo_color" VARCHAR(45),
    "color_ubica_trimestria" VARCHAR(100),
    "estado_colos" VARCHAR(15),
    "foto1" VARCHAR(100),
    "foto2" VARCHAR(100),
    "id_coordination_id" INTEGER,

    CONSTRAINT "Bienes_pkey" PRIMARY KEY ("id_bienes")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_username_key" ON "AuthUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AuthGroup_name_key" ON "AuthGroup"("name");

-- AddForeignKey
ALTER TABLE "AuthUserGroup" ADD CONSTRAINT "AuthUserGroup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthUserGroup" ADD CONSTRAINT "AuthUserGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "AuthGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthUserPermission" ADD CONSTRAINT "AuthUserPermission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreeWetPodificacion" ADD CONSTRAINT "CreeWetPodificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
