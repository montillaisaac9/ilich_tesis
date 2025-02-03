import { NextApiRequest, NextApiResponse } from "next";
import { bucket } from "@/libs/firebaseAdmin";
import formidable, { File } from "formidable";
import fs from "fs/promises";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  try {
    const form = formidable({ multiples: false });

    const [, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    if (!files.image) {
      return res.status(400).json({ success: false, message: "No se subió ningún archivo" });
    }

    // Verificar si 'files.image' es un array y tomar el primer elemento en ese caso.
    let file: File;
    if (Array.isArray(files.image)) {
      file = files.image[0];
    } else {
      file = files.image as File;
    }

    const filePath = file.filepath;
    const filename = `${Date.now()}-${file.originalFilename}`;
    const destination = `images/${filename}`;

    await bucket.upload(filePath, {
      destination,
      public: true,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    const url = `https://storage.googleapis.com/${bucket.name}/${destination}`;

    // Eliminar el archivo temporal
    await fs.unlink(filePath);

    res.json({ success: true, url, filename });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
