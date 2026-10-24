import { NextRequest, NextResponse } from 'next/server';
import { omnirouteService } from '@/lib/omniroute';

export async function POST(request: NextRequest) {
  try {
    const { content, type = 'brief' } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const summary = await omnirouteService.generateSummary(content, type);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in generate-summary API:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
