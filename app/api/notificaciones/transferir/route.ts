import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()

  
    if (!body || !body.assetId || !body.destinoId) {
      return new Response(
        JSON.stringify({ error: 'Datos incompletos o inválidos' }),
        { status: 400 }
      )
    }

    const { assetId, destinoId } = body

    // Obtener bien y coordinación origen
    const asset = await prisma.bienes.findUnique({
      where: { 
        id_bienes: assetId 
      },
      include: { coordinaciones: true }
    })

    if (!asset) {
      return new Response(JSON.stringify({ error: 'Bien no encontrado' }), { status: 404 })
    }

    // Validar coordinación destino
    const coordinacionDestino = await prisma.coordinaciones.findUnique({
      where: { id_coordinacion: Number(destinoId) }
    })

    if (!coordinacionDestino) {
      return new Response(JSON.stringify({ error: 'Coordinación destino no existe' }), { status: 404 })
    }

    // Crear notificación
    const notificacion = await prisma.notificaciones.create({
      data: {
        tipo_operacion: 'transferencia',
        id_coordinacion_origen: asset.coordinaciones?.id_coordinacion,
        id_coordinacion_destino: destinoId, // Usa destinoId aquí si es necesario
        descripcion: `Transferencia de ${asset.nombre_bien} (${asset.numero_inventario}) a ${coordinacionDestino.number_coordinacion}`,
        estado: 'Pendiente',
        id_bienes: asset.id_bienes
      }
    })

    return new Response(JSON.stringify(notificacion), { status: 201 })

  } catch (error) {
    console.error('Error en transferencia:', error)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
