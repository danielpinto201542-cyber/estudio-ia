"use client";

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCw, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';

export default function FlashcardsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studied, setStudied] = useState<Set<number>>(new Set());

  const flashcards = useLiveQuery(async () => {
    const allCards = await db.flashcards.toArray();
    const withDocNames = await Promise.all(
      allCards.map(async (card) => {
        const doc = await db.documents.get(card.documentId);
        return {
          ...card,
          documentName: doc?.name || 'Documento eliminado',
        };
      })
    );
    return withDocNames;
  });

  if (!flashcards) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-600 dark:text-slate-400">
          Cargando flashcards...
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(flashcards.length - 1);
    }
  };

  const handleMarkStudied = (known: boolean) => {
    if (currentCard?.id) {
      const newStudied = new Set(studied);
      if (known) {
        newStudied.add(currentCard.id);
      } else {
        newStudied.delete(currentCard.id);
      }
      setStudied(newStudied);
    }
    handleNext();
  };

  const studiedCount = studied.size;
  const progress = flashcards.length > 0 ? Math.round((studiedCount / flashcards.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <RotateCw className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Flashcards</h1>
              </div>
            </div>

            {flashcards.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {studiedCount} / {flashcards.length} estudiadas ({progress}%)
                </div>
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
        {flashcards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800"
          >
            <RotateCw className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No hay flashcards todavía
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Genera flashcards desde un documento
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir a Documentos
            </button>
          </motion.div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Card counter */}
            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                Tarjeta {currentIndex + 1} de {flashcards.length}
              </span>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {currentCard.documentName}
              </div>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000 mb-8">
              <motion.div
                className="relative w-full h-96 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 flex items-center justify-center text-center shadow-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-white">
                    <div className="text-sm mb-4 opacity-80">PREGUNTA</div>
                    <div className="text-2xl font-bold">{currentCard.front}</div>
                    <div className="text-sm mt-8 opacity-60">Toca para voltear</div>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 flex items-center justify-center text-center shadow-xl"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="text-white">
                    <div className="text-sm mb-4 opacity-80">RESPUESTA</div>
                    <div className="text-xl">{currentCard.back}</div>
                    <div className="text-sm mt-8 opacity-60">Toca para voltear</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevious}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => handleMarkStudied(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                  No la sé
                </button>
                <button
                  onClick={() => handleMarkStudied(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  La sé
                </button>
              </div>

              <button
                onClick={handleNext}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Keyboard hint */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Usa ← → para navegar • Espacio para voltear
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
