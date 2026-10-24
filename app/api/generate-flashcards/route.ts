import { NextRequest, NextResponse } from 'next/server';
import { omnirouteService } from '@/lib/omniroute';

export async function POST(request: NextRequest) {
  try {
    const { content, count = 10 } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const flashcards = await omnirouteService.generateFlashcards(content, count);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error in generate-flashcards API:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
