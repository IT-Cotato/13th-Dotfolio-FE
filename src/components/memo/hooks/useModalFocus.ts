import { useLayoutEffect, useRef, type RefObject } from 'react';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface ModalLayer {
  dialogRef: RefObject<HTMLElement | null>;
}

const modalLayers: ModalLayer[] = [];

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;

  const dialog = modalLayers.at(-1)?.dialogRef.current;
  if (!dialog) return;

  const focusableElements = [...dialog.querySelectorAll<HTMLElement>(focusableSelector)]
    .filter((element) => !element.hasAttribute('hidden'));

  if (focusableElements.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (!dialog.contains(document.activeElement)) {
    event.preventDefault();
    (event.shiftKey ? lastElement : firstElement).focus();
  } else if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

export const useModalFocus = <T extends HTMLElement>(
  initialFocusRef?: RefObject<HTMLElement | null>,
) => {
  const dialogRef = useRef<T>(null);
  const triggerRef = useRef<HTMLElement | null>(
    typeof document === 'undefined' ? null : document.activeElement as HTMLElement | null,
  );

  useLayoutEffect(() => {
    const triggerElement = triggerRef.current;
    const layer: ModalLayer = { dialogRef };
    modalLayers.push(layer);
    if (modalLayers.length === 1) document.addEventListener('keydown', trapFocus);

    const frame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog || modalLayers.at(-1) !== layer) return;

      const initialElement = initialFocusRef?.current
        ?? dialog.querySelector<HTMLElement>(focusableSelector)
        ?? dialog;
      initialElement.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      const wasTopmost = modalLayers.at(-1) === layer;
      const layerIndex = modalLayers.indexOf(layer);
      if (layerIndex >= 0) modalLayers.splice(layerIndex, 1);
      if (modalLayers.length === 0) document.removeEventListener('keydown', trapFocus);

      if (wasTopmost && triggerElement?.isConnected) triggerElement.focus();
    };
  }, [initialFocusRef]);

  return dialogRef;
};
