"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Brain,
  CheckSquare,
  Sparkles,
  BookOpen,
  Zap,
  TrendingUp,
  CreditCard,
  FileCheck
} from "lucide-react";
import FileUploader from "@/components/FileUploader";
import DocumentList from "@/components/DocumentList";
import ActionPanel from "@/components/ActionPanel";
import { db } from "@/lib/db";

export default function Home() {
  const router = useRouter();
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDocumentUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Get statistics
  const stats = useLiveQuery(async () => {
    const docs = await db.documents.count();
    const summaries = await db.summaries.count();
    const tests = await db.tests.count();
    const flashcards = await db.flashcards.count();
    return { docs, summaries, tests, flashcards };
  });

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Resúmenes Inteligentes",
      description: "IA genera resúmenes concisos de tus documentos"
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: "Tests Automáticos",
      description: "Crea cuestionarios personalizados al instante"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Omniroute AI",
      description: "Múltiples IAs con fallback automático"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Aprende Mejor",
      description: "Mejora tu retención y comprensión"
    }
  ];

  const quickLinks = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Resúmenes",
      count: stats?.summaries || 0,
      path: "/summaries",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: "Tests",
      count: stats?.tests || 0,
      path: "/tests",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Flashcards",
      count: stats?.flashcards || 0,
      path: "/flashcards",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Estudio IA
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tu plataforma de apuntes inteligente
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Estudia más inteligentemente
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sube tus documentos y deja que la IA te ayude a crear resúmenes, tests y material de estudio personalizado
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {quickLinks.map((link, index) => (
            <motion.button
              key={index}
              onClick={() => router.push(link.path)}
              className={`p-6 bg-gradient-to-r ${link.color} text-white rounded-xl hover:shadow-lg transition-all text-left`}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between mb-3">
                {link.icon}
                <span className="text-3xl font-bold">{link.count}</span>
              </div>
              <h3 className="font-semibold text-lg">{link.title}</h3>
            </motion.button>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="mb-3 text-blue-600 dark:text-blue-400">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <FileUploader onUploadComplete={handleDocumentUploaded} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ActionPanel documentId={selectedDocumentId} />
          </motion.div>
        </div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <DocumentList
            refreshTrigger={refreshTrigger}
            onDocumentSelect={setSelectedDocumentId}
            selectedDocumentId={selectedDocumentId}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>Estudio IA © 2026 - Potenciado por Omniroute y múltiples modelos de IA</p>
        </div>
      </footer>
    </div>
  );
}
