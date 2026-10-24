"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/db';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  onUploadComplete?: () => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const newUploadedFiles: string[] = [];

    for (const file of acceptedFiles) {
      try {
        let content = '';

        // For text files, read directly in browser
        if (file.type === 'text/plain' || file.name.endsWith('.txt') ||
            file.type === 'text/markdown' || file.name.endsWith('.md')) {
          content = await file.text();
        } else {
          throw new Error('Solo se soportan archivos TXT y MD por ahora');
        }

        // Save to database
        await db.documents.add({
          name: file.name,
          type: file.type,
          content,
          size: file.size,
          uploadedAt: new Date(),
        });

        newUploadedFiles.push(file.name);
        toast.success(`${file.name} subido correctamente`);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Error al subir ${file.name}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    setUploading(false);

    if (onUploadComplete) {
      onUploadComplete();
    }

    // Clear uploaded files notification after 3 seconds
    setTimeout(() => {
      setUploadedFiles([]);
    }, 3000);
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    multiple: true,
    disabled: uploading,
  });

  return (
    <div className="space-y-4">
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 overflow-hidden
          ${isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
        whileHover={{ scale: uploading ? 1 : 1.01 }}
        whileTap={{ scale: uploading ? 1 : 0.99 }}
      >
        <input {...getInputProps()} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          {uploading ? (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Procesando archivos...
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Extrayendo contenido y guardando
                </p>
              </div>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="w-16 h-16 text-blue-600 animate-bounce" />
              <div>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ¡Suelta los archivos aquí!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FileText className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Upload className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  TXT, MD - Múltiples archivos permitidos
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center mt-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300">
                  📃 TXT
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300">
                  📋 MD
                </span>
                <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-xs text-slate-500 dark:text-slate-400">
                  📄 PDF (próximamente)
                </span>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Success notifications */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {uploadedFiles.map((fileName, index) => (
              <motion.div
                key={fileName + index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-800 dark:text-green-200 flex-1 truncate">
                  {fileName}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
