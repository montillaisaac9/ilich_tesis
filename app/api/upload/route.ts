import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Ruta donde se guardarán las imágenes
const uploadDir = path.join(process.cwd(), 'public/uploads');

async function ensureUploadDir() {
  try {
    // Crear la carpeta si no existe
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error al crear la carpeta de subidas:', error);
    throw new Error('No se pudo crear la carpeta de subidas');
  }
}

export async function POST(req: NextRequest) {
  try {
    // Asegurarse de que la carpeta de subidas existe
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ninguna imagen' }, { status: 400 });
    }

    // Validar el tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido' }, { status: 400 });
    }

    // Leer el contenido del archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar el nombre del archivo
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);

    // Guardar el archivo en el servidor
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      message: 'Imagen subida exitosamente',
      fileUrl: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return NextResponse.json({ error: 'Error al procesar la imagen' }, { status: 500 });
  }
}
