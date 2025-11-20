'use client';

import { useCallback, useEffect, useState } from 'react';

type Return = {
  isShow: boolean;
  show: () => void;
  hide: (keys?: string[]) => void;
};

const modalStates: Record<string, boolean> = {};
const modalListeners: Record<string, Set<(val: boolean) => void>> = {};

export function useModal(key: string): Return {
  const [state, setState] = useState(() => modalStates[key] || false);

  useEffect(() => {
    if (!modalListeners[key]) {
      modalListeners[key] = new Set();
    }
    modalListeners[key].add(setState);

    return () => {
      modalListeners[key].delete(setState);
    };
  }, [key]);

  const hide = useCallback(
    (keys?: string[]) => {
      if (keys && keys.length > 0) {
        keys.forEach((k) => {
          modalStates[k] = false;
          modalListeners[k]?.forEach((listener) => listener(false));
        });
      } else {
        modalStates[key] = false;
        modalListeners[key]?.forEach((listener) => listener(false));
      }
    },
    [key],
  );

  const show = useCallback(() => {
    modalStates[key] = true;
    modalListeners[key]?.forEach((listener) => listener(true));
  }, [key]);

  return {
    isShow: state,
    show,
    hide,
  };
}
