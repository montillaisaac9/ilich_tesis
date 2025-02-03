
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  try {
    const filePath = path.join(
      process.cwd(),
      "uploads",
      ...params.path
    );
    
    const file = await readFile(filePath);
    const extension = path.extname(filePath).slice(1);
    
    return new NextResponse(file, {
      headers: {
        "Content-Type": `image/${extension}`
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 }
    );
  }
}