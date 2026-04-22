import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LEVELS, PHASES, type Level } from '@/data/exercises';

export interface SessionEntry {
  id: number;
  date: string;
  time: string;
  level: Level;
  reps: number;
  totalDone: number;
  totalExercises: number;
  completedPhases: number;
  phases: { id: number; label: string; done: number; total: number }[];
}

interface SessionContextValue {
  level: Level;
  setLevel: (l: Level) => void;
  currentPhase: number;
  setCurrentPhase: (i: number) => void;
  completedExercises: Record<number, Set<number>>;
  toggleExercise: (phaseId: number, exerciseIdx: number) => void;
  finishSession: () => void;
  history: SessionEntry[];
  deleteSession: (id: number) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = 'ps_hist_v1';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState<Level>('beginner');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<number, Set<number>>>(
    () => {
      const rec: Record<number, Set<number>> = {};
      PHASES.forEach((p) => { rec[p.id] = new Set<number>(); });
      return rec;
    }
  );
  const [history, setHistory] = useState<SessionEntry[]>([]);
  const historyLoaded = useRef(false);

  useEffect(() => {
    if (historyLoaded.current) return;
    historyLoaded.current = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as SessionEntry[];
          setHistory(parsed);
        }
      })
      .catch(() => {});
  }, []);

  const persistHistory = useCallback((h: SessionEntry[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(h)).catch(() => {});
  }, []);

  const toggleExercise = useCallback((phaseId: number, exerciseIdx: number) => {
    setCompletedExercises((prev) => {
      const next = { ...prev };
      const set = new Set(next[phaseId]);
      if (set.has(exerciseIdx)) {
        set.delete(exerciseIdx);
      } else {
        set.add(exerciseIdx);
      }
      next[phaseId] = set;
      return next;
    });
  }, []);

  const finishSession = useCallback(() => {
    const phases = PHASES.map((p) => ({
      id: p.id,
      label: p.label,
      done: completedExercises[p.id]?.size ?? 0,
      total: p.exercises.length,
    }));
    const totalDone = phases.reduce((a, p) => a + p.done, 0);
    const totalExercises = phases.reduce((a, p) => a + p.total, 0);
    const completedPhases = phases.filter((p) => p.done === p.total).length;

    const now = new Date();
    const entry: SessionEntry = {
      id: Date.now(),
      date: now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      level,
      reps: LEVELS[level].reps,
      totalDone,
      totalExercises,
      completedPhases,
      phases,
    };

    setHistory((prev) => {
      const next = [entry, ...prev];
      persistHistory(next);
      return next;
    });

    const fresh: Record<number, Set<number>> = {};
    PHASES.forEach((p) => { fresh[p.id] = new Set<number>(); });
    setCompletedExercises(fresh);
    setCurrentPhase(0);
  }, [completedExercises, level, persistHistory]);

  const deleteSession = useCallback((id: number) => {
    setHistory((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistHistory(next);
      return next;
    });
  }, [persistHistory]);

  return (
    <SessionContext.Provider
      value={{
        level,
        setLevel,
        currentPhase,
        setCurrentPhase,
        completedExercises,
        toggleExercise,
        finishSession,
        history,
        deleteSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
