import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Obtener el cuerpo de la solicitud
    
    const { assetId, destinoId } = await req.json();

    console.log(`dwadwa ${assetId} bbbbb ${destinoId}`)

    // Validar que se hayan enviado ambos datos
    if (!assetId || !destinoId) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Verificar que el bien exista
    const asset = await prisma.bienes.findUnique({
      where: { id_bienes: assetId },
    });
    if (!asset) {
      return NextResponse.json(
        { error: 'Bien no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que la coordinación destino exista
    const coordinacionDestino = await prisma.coordinaciones.findUnique({
      where: { id_coordinacion: Number(destinoId) },
    });
    if (!coordinacionDestino) {
      return NextResponse.json(
        { error: 'Coordinación destino no existe' },
        { status: 404 }
      );
    }

    // Actualizar el bien para asignarle la nueva coordinación
    const updatedAsset = await prisma.bienes.update({
      where: { id_bienes: assetId },
      data: { id_coordinacion: Number(destinoId) },
    });

    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (error) {
    console.error('Error en transferencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
