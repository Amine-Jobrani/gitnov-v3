// src/components/ui/Toast.tsx
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-3 text-white hover:text-gray-200 text-lg leading-none">×</button>
    </motion.div>
  );
};
