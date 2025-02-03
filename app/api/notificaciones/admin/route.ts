// app/api/notificaciones/admin/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const ID_COORDINACION_ADMIN = 1 // Asegúrate que este ID es correcto

export async function GET() {
  try {
    const notificaciones = await prisma.notificaciones.findMany({
      where: {
        OR: [
          { id_coordinacion_origen: ID_COORDINACION_ADMIN },   // Eliminaciones
          { id_coordinacion_destino: ID_COORDINACION_ADMIN }   // Transferencias
        ],
        estado: 'Pendiente'
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    })

    return NextResponse.json(notificaciones)

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}