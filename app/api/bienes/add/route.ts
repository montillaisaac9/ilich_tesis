import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    // Validación de campos obligatorios
    const requiredFields = ['numero_inventario', 'nombre_bien', 'fecha_ingreso', 'nombre_empleado'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Campos obligatorios faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    console.log(body)

    // Creación del nuevo bien en la base de datos
    const newBien = await prisma.bienes.create({
      data: {
        numero_inventario: body.numero_inventario,
        nombre_bien: body.nombre_bien,
        nombre_empleado: body.nombre_empleado,
        marca: body.marca || null,
        modelo: body.modelo || null,
        serial: body.serial || null,
        caracteristicas: body.caracteristicas || null,
        codigo_color: body.codigo_color || null,
        estado_bien: body.estado_bien || null,
        fecha_ingreso: body.fecha_ingreso,
        tipo_bien: body.tipo_bien,
        id_coordinacion: body.id_coordinacion,
        foto1: body.foto1 || null,
        foto2: body.foto2 || null
      }
    });

    return NextResponse.json(
      { 
        message: `Bien ${body.tipo_bien} creado exitosamente`,
        data: newBien 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error:', error);
    
    // Manejo de errores de clave única
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'El número de inventario ya existe' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    );
  }
}
