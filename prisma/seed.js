const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Insertar coordinaciones
  await prisma.coordinaciones.createMany({
    data: [
      { nombre_coordinacion: 'Dirección General', number_coordinacion: '001-1' },
      { nombre_coordinacion: 'Gestión Administrativa', number_coordinacion: '002-2' },
      { nombre_coordinacion: 'Partidos Políticos', number_coordinacion: '003-3' },
      { nombre_coordinacion: 'Producción y Logística', number_coordinacion: '004-4' },
      { nombre_coordinacion: 'Junta Regional', number_coordinacion: '005-5' },
      { nombre_coordinacion: 'Tecnología de la Información', number_coordinacion: '006-6' },
      { nombre_coordinacion: 'Registro Civil', number_coordinacion: '007-7' },
      { nombre_coordinacion: 'Registro Electoral', number_coordinacion: '008-8' },
      { nombre_coordinacion: 'Vigilantes', number_coordinacion: '009-9' },
      { nombre_coordinacion: 'Administracion', number_coordinacion: '010-10' },
    ],
  });

  // Insertar usuarios
  await prisma.usuarios.createMany({
    data: [
      { username: 'admin', contrase_a: 'admin123', palabra_seguridad: 'superclave', id_coordinacion: 10 },
      { username: 'vigilante', contrase_a: 'vigilante123', palabra_seguridad: 'guardian', id_coordinacion: 9 },
      { username: 'dg_001', contrase_a: 'dg123', palabra_seguridad: 'direccion', id_coordinacion: 1 },
      { username: 'ga_002', contrase_a: 'ga123', palabra_seguridad: 'gestion', id_coordinacion: 2 },
      { username: 'pp_003', contrase_a: 'pp123', palabra_seguridad: 'partidos', id_coordinacion: 3 },
      { username: 'pl_004', contrase_a: 'pl123', palabra_seguridad: 'produccion', id_coordinacion: 4 },
      { username: 'jr_005', contrase_a: 'jr123', palabra_seguridad: 'junta', id_coordinacion: 5 },
      { username: 'ti_006', contrase_a: 'ti123', palabra_seguridad: 'tecnologia', id_coordinacion: 6 },
      { username: 'rc_007', contrase_a: 'rc123', palabra_seguridad: 'civil', id_coordinacion: 7 },
      { username: 're_008', contrase_a: 're123', palabra_seguridad: 'electoral', id_coordinacion: 8 },
    ],
  });

  console.log('✅ Seeding completo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
