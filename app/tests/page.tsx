"use client";

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Target } from 'lucide-react';
import { db, Test } from '@/lib/db';
import toast from 'react-hot-toast';

export default function TestsPage() {
  const router = useRouter();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const tests = useLiveQuery(async () => {
    const allTests = await db.tests.toArray();
    const withDocNames = await Promise.all(
      allTests.map(async (test) => {
        const doc = await db.documents.get(test.documentId);
        return {
          ...test,
          documentName: doc?.name || 'Documento eliminado',
        };
      })
    );
    return withDocNames;
  });

  if (!tests) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-600 dark:text-slate-400">
          Cargando tests...
        </div>
      </div>
    );
  }

  const currentTest = tests[currentTestIndex];
  const hasAnswered = selectedAnswers[currentTestIndex] !== undefined;
  const isCorrect = selectedAnswers[currentTestIndex] === currentTest?.correctAnswer;

  const handleSelectAnswer = (optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentTestIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTestIndex > 0) {
      setCurrentTestIndex(currentTestIndex - 1);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
    const correct = tests.filter((_, idx) => selectedAnswers[idx] === tests[idx].correctAnswer).length;
    toast.success(`¡Terminado! ${correct}/${tests.length} correctas`);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentTestIndex(0);
  };

  const correctCount = tests.filter((_, idx) => selectedAnswers[idx] === tests[idx].correctAnswer).length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const percentage = tests.length > 0 ? Math.round((correctCount / tests.length) * 100) : 0;

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
                <Target className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Tests Interactivos</h1>
              </div>
            </div>

            {tests.length > 0 && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Pregunta {currentTestIndex + 1} de {tests.length}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {tests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800"
          >
            <Target className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No hay tests todavía
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Genera tests desde un documento
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir a Documentos
            </button>
          </motion.div>
        ) : showResults ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">¡Test Completado!</h2>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{correctCount}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Correctas</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{tests.length - correctCount}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Incorrectas</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{percentage}%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Puntuación</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Repetir Test
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Volver a Inicio
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800"
              >
                {/* Document name */}
                <div className="mb-6">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {currentTest.documentName}
                  </span>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">
                  {currentTest.question}
                </h2>

                {/* Options */}
                <div className="space-y-4 mb-8">
                  {currentTest.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentTestIndex] === index;
                    const isCorrectOption = index === currentTest.correctAnswer;
                    const showCorrect = hasAnswered && isCorrectOption;
                    const showIncorrect = hasAnswered && isSelected && !isCorrectOption;

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(index)}
                        disabled={hasAnswered}
                        className={`
                          w-full p-4 rounded-xl text-left transition-all flex items-center gap-3
                          ${!hasAnswered && 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'}
                          ${isSelected && !hasAnswered && 'bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-500'}
                          ${!isSelected && !hasAnswered && 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent'}
                          ${showCorrect && 'bg-green-50 dark:bg-green-950/20 border-2 border-green-500'}
                          ${showIncorrect && 'bg-red-50 dark:bg-red-950/20 border-2 border-red-500'}
                          ${hasAnswered && !showCorrect && !showIncorrect && 'bg-slate-50 dark:bg-slate-800 opacity-50'}
                        `}
                      >
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                          ${showCorrect && 'bg-green-500 text-white'}
                          ${showIncorrect && 'bg-red-500 text-white'}
                          ${!showCorrect && !showIncorrect && isSelected && 'bg-blue-500 text-white'}
                          ${!showCorrect && !showIncorrect && !isSelected && 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}
                        `}>
                          {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                          {showIncorrect && <XCircle className="w-5 h-5" />}
                          {!showCorrect && !showIncorrect && String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1 text-slate-900 dark:text-white">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {hasAnswered && currentTest.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Explicación:
                    </div>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      {currentTest.explanation}
                    </p>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePrevious}
                    disabled={currentTestIndex === 0}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>

                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {answeredCount} / {tests.length} respondidas
                  </div>

                  {currentTestIndex === tests.length - 1 ? (
                    <button
                      onClick={handleFinish}
                      disabled={answeredCount !== tests.length}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Finalizar
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Siguiente
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
