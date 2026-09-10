import { create } from "zustand";

/**
 * Connection and keyboard state, shared by the shell.
 *
 * Fed by `src/lib/native.ts` when running inside the Android app and by plain
 * browser events on the web, so the same components work in both.
 */
export const useUiState = create<{
  /** False while the device has no usable network. */
  online: boolean;
  setOnline: (online: boolean) => void;
  /** True while the soft keyboard is covering part of the screen. */
  keyboardOpen: boolean;
  setKeyboardOpen: (open: boolean) => void;
}>((set) => ({
  online: true,
  setOnline: (online) => set({ online }),
  keyboardOpen: false,
  setKeyboardOpen: (keyboardOpen) => set({ keyboardOpen }),
}));
