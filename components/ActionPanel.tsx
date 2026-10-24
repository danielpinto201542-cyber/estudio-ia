"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckSquare, CreditCard, Loader2, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import toast from 'react-hot-toast';

interface ActionPanelProps {
  documentId: number | null;
}

export default function ActionPanel({ documentId }: ActionPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!documentId) {
      toast.error('Selecciona un documento primero');
      return;
    }

    setLoading('summary');
    try {
      const doc = await db.documents.get(documentId);
      if (!doc) throw new Error('Documento no encontrado');

      // Call API to generate summary
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: doc.content,
          type: 'brief'
        }),
      });

      if (!response.ok) throw new Error('Error al generar resumen');

      const data = await response.json();

      // Save summary
      await db.summaries.add({
        documentId,
        content: data.summary,
        type: 'brief',
        createdAt: new Date(),
      });

      toast.success('Resumen generado correctamente');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Error al generar resumen');
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateTests = async () => {
    if (!documentId) {
      toast.error('Selecciona un documento primero');
      return;
    }

    setLoading('tests');
    try {
      const doc = await db.documents.get(documentId);
      if (!doc) throw new Error('Documento no encontrado');

      // Call API to generate tests
      const response = await fetch('/api/generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: doc.content,
          count: 5
        }),
      });

      if (!response.ok) throw new Error('Error al generar tests');

      const data = await response.json();

      // Save tests
      for (const test of data.tests) {
        await db.tests.add({
          documentId,
          question: test.question,
          options: test.options,
          correctAnswer: test.correctAnswer,
          explanation: test.explanation,
          createdAt: new Date(),
        });
      }

      toast.success(`${data.tests.length} tests generados`);
    } catch (error) {
      console.error('Error generating tests:', error);
      toast.error('Error al generar tests');
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!documentId) {
      toast.error('Selecciona un documento primero');
      return;
    }

    setLoading('flashcards');
    try {
      const doc = await db.documents.get(documentId);
      if (!doc) throw new Error('Documento no encontrado');

      // Call API to generate flashcards
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: doc.content,
          count: 10
        }),
      });

      if (!response.ok) throw new Error('Error al generar flashcards');

      const data = await response.json();

      // Save flashcards
      for (const card of data.flashcards) {
        await db.flashcards.add({
          documentId,
          front: card.front,
          back: card.back,
          createdAt: new Date(),
        });
      }

      toast.success(`${data.flashcards.length} flashcards generadas`);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error('Error al generar flashcards');
    } finally {
      setLoading(null);
    }
  };

  const actions = [
    {
      id: 'summary',
      icon: Brain,
      title: 'Generar Resumen',
      description: 'Crea un resumen inteligente',
      color: 'from-purple-500 to-pink-500',
      onClick: handleGenerateSummary,
    },
    {
      id: 'tests',
      icon: CheckSquare,
      title: 'Crear Tests',
      description: 'Genera preguntas de examen',
      color: 'from-blue-500 to-cyan-500',
      onClick: handleGenerateTests,
    },
    {
      id: 'flashcards',
      icon: CreditCard,
      title: 'Flashcards',
      description: 'Tarjetas de memoria',
      color: 'from-green-500 to-emerald-500',
      onClick: handleGenerateFlashcards,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Acciones IA
        </h3>
      </div>

      {!documentId && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
          Selecciona un documento para usar las acciones IA
        </div>
      )}

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isLoading = loading === action.id;

          return (
            <motion.button
              key={action.id}
              onClick={action.onClick}
              disabled={!documentId || loading !== null}
              className={`
                w-full p-4 rounded-xl text-left transition-all
                ${!documentId || loading !== null
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-md cursor-pointer'
                }
                bg-gradient-to-r ${action.color} text-white
              `}
              whileHover={documentId && !loading ? { scale: 1.02 } : {}}
              whileTap={documentId && !loading ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                ) : (
                  <Icon className="w-5 h-5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {documentId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Las acciones usan Omniroute para garantizar disponibilidad con múltiples IAs
          </p>
        </motion.div>
      )}
    </div>
  );
}
