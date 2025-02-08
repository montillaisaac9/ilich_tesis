import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { id_bienes } = body;


    if (request.method !== 'POST') {
      return NextResponse.json(
        { message: 'Método no permitido' },
        { status: 405 }
      );
    }

    if (!id_bienes) {
      return NextResponse.json(
        { message: 'Se requiere un ID de archivo en el cuerpo de la solicitud' },
        { status: 400 }
      );
    }

    // Obtener el archivo desde la base de datos
    const document = await prisma.bienes.findUnique({
      where: { id_bienes: id_bienes },
    });

    if (!document) {
      return NextResponse.json(
        { message: `Bien con ID ${id_bienes} no encontrado` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Bien encontrado',
        data: document 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en eliminación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
