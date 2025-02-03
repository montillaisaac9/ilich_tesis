// app/api/notificaciones/eliminar/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const ID_COORDINACION_ADMIN = 1 // Reemplaza con el ID real de ADMIN

export async function POST(request: Request) {
  try {
    const { assetId } = await request.json()

    const asset = await prisma.bienes.findUnique({
      where: { id_bienes: assetId },
      include: { coordinaciones: true }
    })

    if (!asset) {
      return NextResponse.json({ error: 'Bien no encontrado' }, { status: 404 })
    }

    // Crear notificación dirigida a ADMIN
    const notificacion = await prisma.notificaciones.create({
      data: {
        tipo_operacion: 'eliminacion',
        id_coordinacion_origen: ID_COORDINACION_ADMIN, // Asignamos a ADMIN
        descripcion: `Solicitud de eliminación: ${asset.nombre_bien} (${asset.numero_inventario}) - Origen: ${asset.coordinaciones?.number_coordinacion}`,
        estado: 'Pendiente',
        id_bienes: asset.id_bienes
      }
    })

    return NextResponse.json(notificacion, { status: 201 })

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