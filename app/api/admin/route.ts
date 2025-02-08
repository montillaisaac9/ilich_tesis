import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener todas las notificaciones, ordenadas por fecha (descendente)
    const notifications = await prisma.notificaciones.findMany({
      where: {estado: 'Pendiente'},
      orderBy: { fecha_creacion: 'desc' }
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
