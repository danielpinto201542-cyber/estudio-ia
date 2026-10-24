import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    let text = '';

    // Only support text-based formats for now
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      text = await file.text();
    } else if (fileType === 'text/markdown' || fileName.endsWith('.md')) {
      text = await file.text();
    } else {
      return NextResponse.json(
        { error: `Por ahora solo soportamos TXT y MD. Convierte tu ${fileName.split('.').pop()?.toUpperCase()} a TXT primero.` },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'El archivo está vacío o no contiene texto' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      name: file.name,
      type: file.type,
      size: file.size,
      content: text,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
