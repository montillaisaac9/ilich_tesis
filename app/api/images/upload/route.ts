import { NextResponse } from "next/server";
import { bucket } from "@/libs/firebaseAdmin";
import { v4 as uuidv4 } from 'uuid';
import path from "path";

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Archivo no válido" },
        { status: 400 }
      );
    }

    const extension = path.extname(file.name);
    const filename = `${uuidv4()}${extension}`;
    const destination = `images/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const fileRef = bucket.file(destination);
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000",
      },
    });

    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    });

    return NextResponse.json({
      success: true,
      url,
      filename
    });

  } catch (error) {
    console.error("Error en upload:", error);
    return NextResponse.json(
      { error: "Error procesando la imagen" },
      { status: 500 }
    );
  }
};