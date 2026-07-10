/**
 * Zustand UI store — tiny by design.
 *
 * Holds ONLY discrete UI state that genuinely needs React reactivity
 * (loader gate, open modal, hovered landmark). Continuous scroll data lives
 * in the mutable `scrollState` object, NOT here, to avoid per-frame renders.
 */
import { create } from "zustand";

export interface UIState {
  /** Fonts + first canvas frame ready → fade the loader out. */
  ready: boolean;
  /** Id of the project whose modal is open, or null. */
  selectedProject: string | null;
  /** Id of the landmark/card currently hovered (drives cursor + hint). */
  hovered: string | null;
  /** Ambient audio toggle (off by default for autoplay policies). */
  audioOn: boolean;
  setReady: (ready: boolean) => void;
  setSelectedProject: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  setAudioOn: (on: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  ready: false,
  selectedProject: null,
  hovered: null,
  audioOn: false,
  setReady: (ready) => set({ ready }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  setHovered: (hovered) => set({ hovered }),
  setAudioOn: (audioOn) => set({ audioOn }),
}));
