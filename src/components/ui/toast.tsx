import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 2400 }: ToastProps) {
  React.useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4 pointer-events-none"
        >
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-[#071911]/90 px-4 py-3 shadow-[0_0_25px_rgba(34,197,94,0.3)] backdrop-blur-xl">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
            <p className="text-sm font-medium tracking-wide text-emerald-100">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
