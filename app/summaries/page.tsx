"use client";

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Copy, Check, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import toast from 'react-hot-toast';

export default function SummariesPage() {
  const router = useRouter();
  const [copied, setCopied] = useState<number | null>(null);

  const summaries = useLiveQuery(async () => {
    const allSummaries = await db.summaries.toArray();

    // Get document names
    const withDocNames = await Promise.all(
      allSummaries.map(async (summary) => {
        const doc = await db.documents.get(summary.documentId);
        return {
          ...summary,
          documentName: doc?.name || 'Documento eliminado',
        };
      })
    );

    return withDocNames.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  const handleCopy = (content: string, id: number) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (content: string, documentName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen-${documentName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Descargado');
  };

  if (!summaries) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-600 dark:text-slate-400">
          Cargando resúmenes...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Resúmenes Generados</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {summaries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800"
          >
            <Sparkles className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No hay resúmenes todavía
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Genera tu primer resumen desde un documento
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir a Documentos
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {summaries.map((summary, index) => (
              <motion.div
                key={summary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
                      {summary.documentName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        {summary.type === 'brief' ? 'Breve' : summary.type === 'detailed' ? 'Detallado' : 'Puntos'}
                      </span>
                      <span>
                        {new Date(summary.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => summary.id && handleCopy(summary.content, summary.id)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Copiar"
                    >
                      {copied === summary.id ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(summary.content, summary.documentName)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Descargar"
                    >
                      <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {summary.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
