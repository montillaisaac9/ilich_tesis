// app/api/export-desincorporados/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Consultar los bienes en la base de datos
    const bienes = await prisma.bienes.findMany();

    // 2. Cargar el archivo plantilla desde public/formats
    const templatePath = path.join(process.cwd(), 'public', 'formats', 'FORMATO FINAL BIENES DESINCORPORADOS 2024.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 3. Seleccionar la hoja donde se rellenarán los datos
    const worksheet = workbook.getWorksheet('DESINCORPORACION');
    if (!worksheet) {
      return NextResponse.json(
        { error: 'La hoja DESINCORPORACION no se encontró en el template.' },
        { status: 500 }
      );
    }

    // 4. Rellenar la hoja con los datos (ajusta el mapeo según tu plantilla)
    let startRow = 5;
    bienes.forEach((bien, index) => {
      const row = worksheet.getRow(startRow + index);
      row.getCell(1).value  = bien.numero_inventario;
      row.getCell(2).value  = bien.nombre_bien;
      row.getCell(3).value  = bien.marca;
      row.getCell(4).value  = bien.modelo;
      row.getCell(5).value  = bien.serial;
      row.getCell(6).value  = bien.caracteristicas;
      row.getCell(7).value  = bien.estado_bien;
      row.getCell(8).value  = bien.foto1;
      row.getCell(9).value  = bien.foto2;
      row.getCell(10).value = bien.nombre_empleado;
      row.getCell(11).value = bien.fecha_ingreso;
      row.getCell(12).value = bien.codigo_color;
      row.getCell(13).value = bien.tipo_bien;
      row.commit();
    });

    // 5. Generar el Excel en memoria
    const buffer = await workbook.xlsx.writeBuffer();

    // 6. Configurar las cabeceras y devolver la respuesta con el archivo Excel
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
