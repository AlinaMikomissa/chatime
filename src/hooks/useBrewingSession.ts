"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Tea } from "@/types/tea";
import { BrewingSession, InfusionRecord, createSession } from "@/types/session";

export type BrewingState = "ready" | "running" | "paused" | "complete";

export interface BrewingSessionState {
  brewingState: BrewingState;
  currentInfusion: number; // 0-based
  totalInfusions: number;
  secondsRemaining: number;
  currentSteepSeconds: number;
  sessionElapsedSeconds: number;
  completedInfusions: InfusionRecord[];
  session: BrewingSession | null;
}

export interface BrewingActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  pourAndNext: () => void;
  endSession: () => void;
}

function getSteepTime(tea: Tea, infusionIndex: number): number {
  const { baseSteepSeconds, steepIncrementSeconds } = tea.brewingParameters;
  return baseSteepSeconds + infusionIndex * steepIncrementSeconds;
}

export function useBrewingSession(tea: Tea): [BrewingSessionState, BrewingActions] {
  const totalInfusions = tea.brewingParameters.infusionCount.max;
  const [brewingState, setBrewingState] = useState<BrewingState>("ready");
  const [currentInfusion, setCurrentInfusion] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(getSteepTime(tea, 0));
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState(0);
  const [completedInfusions, setCompletedInfusions] = useState<InfusionRecord[]>([]);
  const [session, setSession] = useState<BrewingSession | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const steepStartRef = useRef<number>(0);

  const currentSteepSeconds = getSteepTime(tea, currentInfusion);

  // Clear timer interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearSessionTimer = useCallback(() => {
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
    }
  }, []);

  // Start the countdown
  const startCountdown = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setBrewingState("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // Start session timer
  const startSessionTimer = useCallback(() => {
    if (sessionIntervalRef.current) return;
    sessionIntervalRef.current = setInterval(() => {
      setSessionElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  const start = useCallback(() => {
    const newSession = createSession(tea.id);
    setSession(newSession);
    setBrewingState("running");
    steepStartRef.current = Date.now();
    startCountdown();
    startSessionTimer();
  }, [tea.id, startCountdown, startSessionTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setBrewingState("paused");
  }, [clearTimer]);

  const resume = useCallback(() => {
    setBrewingState("running");
    startCountdown();
  }, [startCountdown]);

  const reset = useCallback(() => {
    clearTimer();
    setSecondsRemaining(currentSteepSeconds);
    setBrewingState("running");
    steepStartRef.current = Date.now();
    startCountdown();
  }, [clearTimer, currentSteepSeconds, startCountdown]);

  const advanceToNext = useCallback(() => {
    const actualSeconds = currentSteepSeconds - secondsRemaining;
    const record: InfusionRecord = {
      index: currentInfusion,
      plannedSeconds: currentSteepSeconds,
      actualSeconds,
      skipped: false,
    };
    setCompletedInfusions((prev) => [...prev, record]);

    const nextInfusion = currentInfusion + 1;
    if (nextInfusion >= totalInfusions) {
      // All infusions done
      clearTimer();
      clearSessionTimer();
      setBrewingState("ready");
      setCurrentInfusion(0);
      setSecondsRemaining(getSteepTime(tea, 0));
      setSessionElapsedSeconds(0);
      setCompletedInfusions([]);
      setSession(null);
      return;
    }

    const nextSteep = getSteepTime(tea, nextInfusion);
    setCurrentInfusion(nextInfusion);
    setSecondsRemaining(nextSteep);
    setBrewingState("running");
    steepStartRef.current = Date.now();
    startCountdown();
  }, [currentInfusion, currentSteepSeconds, secondsRemaining, totalInfusions, tea, clearTimer, clearSessionTimer, startCountdown]);

  const skip = useCallback(() => {
    const record: InfusionRecord = {
      index: currentInfusion,
      plannedSeconds: currentSteepSeconds,
      actualSeconds: 0,
      skipped: true,
    };
    setCompletedInfusions((prev) => [...prev, record]);

    const nextInfusion = currentInfusion + 1;
    if (nextInfusion >= totalInfusions) {
      clearTimer();
      clearSessionTimer();
      setBrewingState("ready");
      setCurrentInfusion(0);
      setSecondsRemaining(getSteepTime(tea, 0));
      setSessionElapsedSeconds(0);
      setCompletedInfusions([]);
      setSession(null);
      return;
    }

    const nextSteep = getSteepTime(tea, nextInfusion);
    setCurrentInfusion(nextInfusion);
    setSecondsRemaining(nextSteep);
    setBrewingState("running");
    steepStartRef.current = Date.now();
    clearTimer();
    startCountdown();
  }, [currentInfusion, currentSteepSeconds, totalInfusions, tea, clearTimer, clearSessionTimer, startCountdown]);

  const pourAndNext = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const endSession = useCallback(() => {
    clearTimer();
    clearSessionTimer();
    setBrewingState("ready");
    setCurrentInfusion(0);
    setSecondsRemaining(getSteepTime(tea, 0));
    setSessionElapsedSeconds(0);
    setCompletedInfusions([]);
    setSession(null);
  }, [clearTimer, clearSessionTimer, tea]);

  // Reset when tea changes
  useEffect(() => {
    clearTimer();
    clearSessionTimer();
    setBrewingState("ready");
    setCurrentInfusion(0);
    setSecondsRemaining(getSteepTime(tea, 0));
    setSessionElapsedSeconds(0);
    setCompletedInfusions([]);
    setSession(null);
  }, [tea.id, clearTimer, clearSessionTimer, tea]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      clearSessionTimer();
    };
  }, [clearTimer, clearSessionTimer]);

  const state: BrewingSessionState = {
    brewingState,
    currentInfusion,
    totalInfusions,
    secondsRemaining,
    currentSteepSeconds,
    sessionElapsedSeconds,
    completedInfusions,
    session,
  };

  const actions: BrewingActions = {
    start,
    pause,
    resume,
    reset,
    skip,
    pourAndNext,
    endSession,
  };

  return [state, actions];
}
