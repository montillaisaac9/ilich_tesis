import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

type WhereInput = {
  id_coordinacion?: number;
  tipo_bien?: string;
};

export async function POST(request: Request) {
  try {
    const { page, limit, tipoBien, id_coordinacion } = await request.json();

    // Convertir parámetros de paginación
    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;

    // Construir condiciones de filtrado
    const whereCondition: WhereInput = {
      ...(id_coordinacion && { id_coordinacion: Number(id_coordinacion) }),
      ...(tipoBien && { tipo_bien: tipoBien })
    };

    // Obtener datos paginados
    const [data, total] = await Promise.all([
      prisma.bienes.findMany({
        where: whereCondition,
        skip: (currentPage - 1) * currentLimit,
        take: currentLimit,
        include: { coordinaciones: true },
        orderBy: { fecha_ingreso: 'desc' }
      }),
      prisma.bienes.count({ where: whereCondition })
    ]);

    return NextResponse.json({
      data,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit)
      }
    });

  } catch (error) {
    console.error('Error en POST /api/bienes:', error);
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}