// app/api/export-desincorporados/route.ts
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
    const templatePath = path.join(process.cwd(), 'public', 'formats', 'FORMATO FINAL BIENES DESINCORPORADOS 2024.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 3. Seleccionar la hoja donde se rellenarán los datos
    const worksheet = workbook.getWorksheet('DIRECCIÓN');
    const worksheet2 = workbook.getWorksheet('ADMINISTRACIÓN ');
    if (!worksheet) {
      return NextResponse.json(
        { error: 'La hoja DESINCORPORACION no se encontró en el template.' },
        { status: 500 }
      );
    }

    if (!worksheet2) {
      console.log("ñaooo")
      return NextResponse.json(
        { error: 'La hoja DESINCORPORACION no se encontró en el template.' },
        { status: 500 }
      );
    }

    // 4. Rellenar la hoja con los datos (ajusta el mapeo según tu plantilla)
    const startRow = 15;
    bienes.forEach((bien, index) => {
      const row = worksheet.getRow(startRow + index);
      row.getCell(2).value  = bien.coordinaciones?.number_coordinacion || ''
      row.getCell(3).value  = bien.numero_inventario
      row.getCell(4).value  = bien.nombre_bien
      row.getCell(5).value  = bien.marca
      row.getCell(6).value  = bien.modelo
      row.getCell(7).value  = bien.serial
      row.getCell(8).value  = bien.caracteristicas
      row.getCell(9).value  = bien.codigo_color
      row.commit();
    });

    bienes.forEach((bien, index) => {
      const row = worksheet2.getRow(startRow + index);
      row.getCell(2).value  = bien.coordinaciones?.number_coordinacion || ''
      row.getCell(3).value  = bien.numero_inventario
      row.getCell(4).value  = bien.nombre_bien
      row.getCell(5).value  = bien.marca
      row.getCell(6).value  = bien.modelo
      row.getCell(7).value  = bien.serial
      row.getCell(8).value  = bien.caracteristicas
      row.getCell(9).value  = bien.codigo_color
      row.commit();
    });


    // 5. Generar el Excel en memoria
    const buffer = await workbook.xlsx.writeBuffer();

    const headers = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Bienes_Desincorporados.xlsx"'
    };
    return new Response(buffer, { headers });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error generando el Excel de Bienes Desincorporados' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
