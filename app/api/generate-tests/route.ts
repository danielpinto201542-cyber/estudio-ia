import { NextRequest, NextResponse } from 'next/server';
import { omnirouteService } from '@/lib/omniroute';

export async function POST(request: NextRequest) {
  try {
    const { content, count = 5 } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const tests = await omnirouteService.generateTests(content, count);

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Error in generate-tests API:', error);
    return NextResponse.json(
      { error: 'Failed to generate tests' },
      { status: 500 }
    );
  }
}
