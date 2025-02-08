import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Obtener el cuerpo de la solicitud
    console.log(req.json)
    const { assetId } = await req.json();

    // Validar que se haya enviado el assetId
    if (!assetId) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Eliminar el bien
    const deletedAsset = await prisma.bienes.delete({
      where: { id_bienes: assetId },
    });

    return NextResponse.json(deletedAsset, { status: 200 });
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
