"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./toast.css";

// Default value is a no-op, so a page rendered outside the provider
// won't crash (the toast just won't show).
const ToastContext = createContext({ showToast: () => {} });

export function ToastProvider({ children, duration = 3000 }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (text) => {
      setMessage(text);
      setVisible(true);
      // Restart the timer so rapid clicks don't hide the toast early.
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), duration);
    },
    [duration]
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={visible ? "tl-toast is-visible" : "tl-toast"}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
