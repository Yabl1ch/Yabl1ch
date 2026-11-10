import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

export interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

function ToastComponent({ message, onClose, duration = 2400 }: ToastProps) {
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto"
          >
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-[#071911]/95 px-5 py-3 shadow-[0_0_30px_rgba(34,197,94,0.35)] backdrop-blur-xl">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <p className="text-sm font-medium tracking-wide text-emerald-100">
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Toast = React.memo(ToastComponent);
export default Toast;
