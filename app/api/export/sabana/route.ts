// app/api/export-sabana/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Consultar los bienes en la base de datos (solo los campos requeridos)
    const bienes = await prisma.bienes.findMany({
      select: {
        numero_inventario: true,
        nombre_bien: true,
        marca: true,
        modelo: true,
        serial: true,
        caracteristicas: true,
        estado_bien: true,
        nombre_empleado: true,
        fecha_ingreso: true,
        codigo_color: true,
        tipo_bien: true
      }
    });

    // 2. Cargar el archivo plantilla desde public/formats
    const templatePath = path.join(process.cwd(), 'public', 'formats', 'SABANA CARACAS.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 3. Seleccionar la hoja "REPORTE"
    const worksheet = workbook.getWorksheet('REPORTE');
    if (!worksheet) {
      return NextResponse.json(
        { error: 'La hoja REPORTE no se encontró en el template.' },
        { status: 500 }
      );
    }

    // 4. Suponemos que la primera fila es el encabezado.
    //    Si la plantilla tiene encabezados en la fila 1 y los datos deben ir a partir de la fila 2,
    //    entonces se conserva la primera fila y se eliminan las demás.
    const headerRowCount = 1; 
    const startRow = headerRowCount + 1;

    if (worksheet.rowCount > headerRowCount) {
      // Se eliminan todas las filas a partir de la fila 2
      worksheet.spliceRows(startRow, worksheet.rowCount - headerRowCount);
    }

    // 5. Insertar los nuevos datos usando addRow (se agregarán a partir de la fila 2)
    bienes.forEach((bien) => {
      worksheet.addRow([
        bien.numero_inventario, // Columna A
        bien.nombre_bien,       // Columna B
        bien.marca,             // Columna C
        bien.modelo,            // Columna D
        bien.serial,            // Columna E
        bien.caracteristicas,   // Columna F
        bien.estado_bien,       // Columna G
        bien.nombre_empleado,   // Columna H
        bien.fecha_ingreso,     // Columna I
        bien.codigo_color,      // Columna J
        bien.tipo_bien          // Columna K
      ]);
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
