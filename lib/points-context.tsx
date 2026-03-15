"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState<number>(65);

  // Load points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem("kenboost_points");
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("kenboost_points", points.toString());
  }, [points]);

  const addPoints = (amount: number) => {
    setPoints((prev) => Math.min(prev + amount, 100));
  };

  return (
    <PointsContext.Provider value={{ points, addPoints }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
}
