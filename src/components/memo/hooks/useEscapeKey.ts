import { useEffect, useLayoutEffect, useRef } from 'react';

interface EscapeHandler {
  id: symbol;
  callback: () => void;
}

const escapeHandlers: EscapeHandler[] = [];

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return;
  escapeHandlers.at(-1)?.callback();
};

export const useEscapeKey = (onEscape: () => void) => {
  const onEscapeRef = useRef(onEscape);

  useLayoutEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    const handler = {
      id: Symbol('escape-handler'),
      callback: () => onEscapeRef.current(),
    };

    escapeHandlers.push(handler);
    if (escapeHandlers.length === 1) window.addEventListener('keydown', handleEscape);

    return () => {
      const handlerIndex = escapeHandlers.findIndex(({ id }) => id === handler.id);
      if (handlerIndex >= 0) escapeHandlers.splice(handlerIndex, 1);
      if (escapeHandlers.length === 0) window.removeEventListener('keydown', handleEscape);
    };
  }, []);
};
