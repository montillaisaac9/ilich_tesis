import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    // Verificar que el cuerpo no sea null o vacío y contenga los datos necesarios
    if (!body || !body.notificacionId || !body.nuevoEstado) {
      return new Response(
        JSON.stringify({ error: 'Datos incompletos o inválidos' }),
        { status: 400 }
      )
    }

    const { notificacionId, nuevoEstado } = body

    // Validar que el nuevo estado sea uno de los permitidos
    const estadosPermitidos = ['resuelto', 'ignorado', 'rechazado']
    if (!estadosPermitidos.includes(nuevoEstado.toLowerCase())) {
      return new Response(
        JSON.stringify({
          error:
            'Estado no válido. Valores permitidos: resuelto, ignorado, rechazado'
        }),
        { status: 400 }
      )
    }

    // Verificar que la notificación exista
    const notificacionExistente = await prisma.notificaciones.findUnique({
      where: { id_notificacion: notificacionId }
    })

    if (!notificacionExistente) {
      return new Response(
        JSON.stringify({ error: 'Notificación no encontrada' }),
        { status: 404 }
      )
    }

    // Actualizar la notificación
    const notificacionActualizada = await prisma.notificaciones.update({
      where: { id_notificacion: notificacionId },
      data: { estado: nuevoEstado }
    })

    return new Response(JSON.stringify(notificacionActualizada), { status: 200 })
  } catch (error) {
    console.error('Error actualizando notificación:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
