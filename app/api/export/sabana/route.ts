// app/api/export-sabana/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {

    const bienes = await prisma.bienes.findMany({
      include: {
        coordinaciones: {
          select: {
            number_coordinacion: true
          }
        }
      }
    });

    // 2. Cargar el archivo plantilla desde public/formats
    const templatePath = path.join(process.cwd(), 'public', 'formats', 'SABANA CARACAS.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 3. Seleccionar la hoja "REPORTE"
    const worksheet = workbook.getWorksheet('DESINCORPORACION');
    if (!worksheet) {
      return NextResponse.json(
        { error: 'La hoja REPORTE no se encontró en el template.' },
        { status: 500 }
      );
    }

    const startRow = 8;
    bienes.forEach((bien, index) => {
      const row = worksheet.getRow(startRow + index);
      row.getCell(1).value  = bien.numero_inventario
      row.getCell(2).value  = bien.nombre_bien
      row.getCell(3).value  = bien.marca
      row.getCell(4).value  = bien.modelo
      row.getCell(5).value  = bien.serial
      row.getCell(7).value  = bien.caracteristicas
      row.commit();
    });

    // 6. Generar el Excel en memoria
    const buffer = await workbook.xlsx.writeBuffer();

    // 7. Configurar las cabeceras y devolver la respuesta con el archivo Excel
    const headers = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Sabana_Caracas.xlsx"'
    };
    return new Response(buffer, { headers });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error generando el Excel de Sabana Caracas' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
