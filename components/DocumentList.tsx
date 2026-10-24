"use client";

import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Calendar, Hash } from 'lucide-react';
import { db, Document } from '@/lib/db';
import { formatFileSize, getFileIcon, truncateText } from '@/lib/utils';
import toast from 'react-hot-toast';

interface DocumentListProps {
  refreshTrigger?: number;
  onDocumentSelect?: (id: number) => void;
  selectedDocumentId?: number | null;
}

export default function DocumentList({
  refreshTrigger,
  onDocumentSelect,
  selectedDocumentId
}: DocumentListProps) {
  const documents = useLiveQuery(() =>
    db.documents.orderBy('uploadedAt').reverse().toArray()
  );

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      return;
    }

    try {
      await db.documents.delete(id);
      await db.tests.where('documentId').equals(id).delete();
      await db.flashcards.where('documentId').equals(id).delete();
      await db.summaries.where('documentId').equals(id).delete();

      toast.success('Documento eliminado');

      if (selectedDocumentId === id && onDocumentSelect) {
        onDocumentSelect(null);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error al eliminar documento');
    }
  };

  const handleDocumentClick = (id: number) => {
    if (onDocumentSelect) {
      onDocumentSelect(id);
    }
  };

  if (!documents) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800"
      >
        <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No hay documentos todavía
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Sube tu primer documento para empezar a estudiar
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tus Documentos
        </h2>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
          {documents.length} {documents.length === 1 ? 'documento' : 'documentos'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => doc.id && handleDocumentClick(doc.id)}
              className={`
                group relative bg-white dark:bg-slate-900 rounded-xl p-6 border-2
                transition-all cursor-pointer hover:shadow-lg
                ${selectedDocumentId === doc.id
                  ? 'border-blue-500 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                }
              `}
              whileHover={{ y: -4 }}
            >
              {/* Delete button */}
              <button
                onClick={(e) => doc.id && handleDelete(doc.id, e)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-950/40"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* File icon */}
              <div className="text-4xl mb-3">
                {getFileIcon(doc.type)}
              </div>

              {/* Document name */}
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 pr-8 truncate">
                {doc.name}
              </h3>

              {/* Content preview */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {truncateText(doc.content, 100)}
              </p>

              {/* Metadata */}
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(doc.uploadedAt).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  <span>{formatFileSize(doc.size)}</span>
                </div>
              </div>

              {/* Selected indicator */}
              {selectedDocumentId === doc.id && (
                <motion.div
                  layoutId="selectedIndicator"
                  className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
