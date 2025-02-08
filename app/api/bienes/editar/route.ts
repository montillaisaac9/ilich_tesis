import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(request: Request): Promise<Response> {
  try {
    if (!request.body) {
      return NextResponse.json(
        { message: 'El cuerpo de la petición no puede estar vacío' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validación del ID
    if (!body.id_bienes) {
      return NextResponse.json(
        { message: 'El campo id_bienes es obligatorio' },
        { status: 400 }
      );
    }

    // Construcción de los datos de actualización
    const updateData: Record<string, any> = {};

    const campos = [
      'numero_inventario', 'nombre_bien', 'nombre_empleado', 
      'marca', 'modelo', 'serial', 'caracteristicas', 
      'codigo_color', 'estado_bien', 'fecha_ingreso', 
      'tipo_bien', 'id_coordinacion', 'foto1', 'foto2'
    ];

    campos.forEach((campo) => {
      if (body[campo] !== undefined && body[campo] !== null) {
        updateData[campo] = body[campo];
      }
    });

    // Validar si hay datos a actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No hay datos válidos para actualizar' },
        { status: 400 }
      );
    }

    // Actualizar en la base de datos
    const updatedBien = await prisma.bienes.update({
      where: { id_bienes: body.id_bienes }, // Corregido de `body.id`
      data: updateData,
    });

    return NextResponse.json(
      { 
        message: `Bien ${body.nombre_bien || body.id_bienes} actualizado exitosamente`,
        data: updatedBien 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
