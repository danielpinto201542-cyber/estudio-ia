import axios from 'axios';

export interface OmnirouteConfig {
  apiKey: string;
  endpoint: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}

class OmnirouteService {
  private config: OmnirouteConfig;

  constructor() {
    this.config = {
      apiKey: process.env.OMNIROUTE_API_KEY || 'local',
      endpoint: process.env.OMNIROUTE_ENDPOINT || 'http://localhost:20128/v1',
      temperature: 0.7,
      maxTokens: 2000,
    };
  }

  async chat(messages: AIMessage[], options?: Partial<OmnirouteConfig>): Promise<AIResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add Authorization if API key is not 'local'
      if (this.config.apiKey && this.config.apiKey !== 'local') {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const response = await axios.post(
        `${this.config.endpoint}/chat/completions`,
        {
          model: options?.model || 'gpt-4o-mini',
          messages,
          temperature: options?.temperature || this.config.temperature,
          max_tokens: options?.maxTokens || this.config.maxTokens,
        },
        { headers }
      );

      return {
        content: response.data.choices[0].message.content,
        model: response.data.model,
        tokensUsed: response.data.usage?.total_tokens,
      };
    } catch (error) {
      console.error('Omniroute API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw new Error('Error al comunicarse con Omniroute AI');
    }
  }

  async generateSummary(content: string, type: 'brief' | 'detailed' | 'bullet-points' = 'brief'): Promise<string> {
    const systemPrompts = {
      brief: 'Eres un asistente que crea resúmenes concisos y claros de documentos educativos. Resume el contenido en 2-3 párrafos capturando las ideas principales.',
      detailed: 'Eres un asistente que crea resúmenes detallados de documentos educativos. Proporciona un análisis exhaustivo del contenido, incluyendo todos los puntos importantes y ejemplos relevantes.',
      'bullet-points': 'Eres un asistente que crea resúmenes estructurados de documentos educativos. Resume el contenido usando viñetas organizadas por temas principales.',
    };

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompts[type],
      },
      {
        role: 'user',
        content: `Resumen el siguiente contenido:\n\n${content}`,
      },
    ];

    const response = await this.chat(messages);
    return response.content;
  }

  async generateTests(content: string, count: number = 5): Promise<any[]> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `Eres un asistente que crea preguntas de examen tipo test a partir de contenido educativo.
        Genera exactamente ${count} preguntas de opción múltiple con 4 opciones cada una.
        Responde SOLO con un JSON array válido, sin texto adicional.
        Formato: [{"question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": 0, "explanation": "..."}]`,
      },
      {
        role: 'user',
        content: `Crea ${count} preguntas tipo test del siguiente contenido:\n\n${content.slice(0, 3000)}`,
      },
    ];

    const response = await this.chat(messages, { maxTokens: 3000 });

    try {
      const cleanedContent = response.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Error parsing test JSON:', error);
      throw new Error('Error al generar tests');
    }
  }

  async generateFlashcards(content: string, count: number = 10): Promise<any[]> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `Eres un asistente que crea flashcards educativas a partir de contenido.
        Genera exactamente ${count} flashcards con conceptos clave.
        Responde SOLO con un JSON array válido, sin texto adicional.
        Formato: [{"front": "Pregunta o concepto", "back": "Respuesta o explicación"}]`,
      },
      {
        role: 'user',
        content: `Crea ${count} flashcards del siguiente contenido:\n\n${content.slice(0, 3000)}`,
      },
    ];

    const response = await this.chat(messages, { maxTokens: 2000 });

    try {
      const cleanedContent = response.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Error parsing flashcards JSON:', error);
      throw new Error('Error al generar flashcards');
    }
  }

  async explainConcept(content: string, concept: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'Eres un tutor educativo que explica conceptos de manera clara y accesible.',
      },
      {
        role: 'user',
        content: `Del siguiente contenido:\n\n${content}\n\nExplica el concepto: "${concept}"`,
      },
    ];

    const response = await this.chat(messages);
    return response.content;
  }
}

export const omnirouteService = new OmnirouteService();
