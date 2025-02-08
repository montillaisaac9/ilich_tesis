import type { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Extender Request para incluir la propiedad "file" que asigna Multer
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Directorio donde se guardarán las imágenes
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Crear la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para guardar imágenes (único archivo por solicitud)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Se agrega la fecha para generar nombres únicos, manteniendo la extensión original
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro para permitir solo imágenes
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, JPG, WEBP)'));
  }
};

// Limite de tamaño: 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Desactivar el bodyParser de Next.js para que Multer procese multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request, res: Response) {
  // Solo se permite el método POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  // Procesar la subida del archivo usando Multer
  return new Promise<void>((resolve, reject) => {
    upload.single('image')(req as RequestWithFile, res, (err: unknown) => {
      if (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(400).json({ error: errorMessage });
        return reject(err);
      }

      const file = (req as RequestWithFile).file;
      if (!file) {
        res.status(400).json({ error: 'No se subió ninguna imagen' });
        return reject('No se subió ninguna imagen');
      }

      // Retornar la URL del archivo subido
      res.status(200).json({
        message: 'Imagen subida exitosamente',
        fileUrl: `/uploads/${file.filename}`,
      });
      resolve();
    });
  });
}
