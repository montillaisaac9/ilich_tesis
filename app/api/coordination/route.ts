import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id_coordinacion } = await request.json();

    // Verificamos que se haya enviado el id
    if (!id_coordinacion) {
      return NextResponse.json(
        { message: 'El id_coordinacion es requerido' },
        { status: 400 }
      );
    }

    // Convertimos a número en caso de que se reciba como string
    const coordinacionId = Number(id_coordinacion);
    if (isNaN(coordinacionId)) {
      return NextResponse.json(
        { message: 'El id_coordinacion debe ser un número válido' },
        { status: 400 }
      );
    }

    // Buscamos la coordinación por su id
    const coordinacion = await prisma.coordinaciones.findUnique({
      where: { id_coordinacion: coordinacionId },
    });

    // Si no se encontró la coordinación, retornamos un error 404
    if (!coordinacion) {
      return NextResponse.json(
        { message: 'No se encontró la coordinación con el id proporcionado' },
        { status: 404 }
      );
    }

    // Retornamos la coordinación encontrada
    return NextResponse.json({ data: coordinacion });
  } catch (error) {
    console.error('Error en POST /api/coordinaciones:', error);
    return NextResponse.json(
      {
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
