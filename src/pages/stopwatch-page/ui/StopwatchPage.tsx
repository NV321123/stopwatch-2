import React, { useState, useRef, useCallback } from "react";
import { StopwatchCard } from "@/entities/stopwatch/ui/StopwatchCard";
import type { StopwatchState } from "@/entities/stopwatch/model/types";
import { StopwatchStatus } from "@/entities/stopwatch/model/types";
import { Button } from '@/shared/ui/Button/Button';
import { ButtonVariant } from '@/shared/ui/Button/Button.types';
import { IconPlus } from "@/shared/ui/Icon/icons";
import styles from "./StopwatchPage.module.css";

const StopwatchHeaderAdd: React.FC<{ onAdd: () => void }> = React.memo(({ onAdd }) => {
  console.log("HeaderAdd render");
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Stopwatch</h1>
      <Button
        variant={ButtonVariant.ADD}
        onClick={onAdd}
        ariaLabel="Add new stopwatch"
      >
        <IconPlus className={styles.icon} /> Add New Stopwatch
      </Button>
    </header>
  );
});

export const StopwatchPage: React.FC = () => {
  const [stopwatches, setStopwatches] = useState<StopwatchState[]>([]);
  const nextIdRef = useRef<number>(1);

  const addStopwatch = useCallback(() => {
    const newId = nextIdRef.current;
    nextIdRef.current += 1;
    const newStopwatch: StopwatchState = {
      id: newId,
      status: StopwatchStatus.IDLE,
      accumulated: 0,
      startTime: 0,
    };

    setStopwatches(prev => [...prev, newStopwatch]);
  }, []);

  const deleteStopwatch = useCallback((id: number) => {
    setStopwatches(prev => prev.filter(s => s.id !== id));
  }, []);

  console.log("StopwatchPage render");

  return (
    <div className={styles.container}>
      <StopwatchHeaderAdd onAdd={addStopwatch} />

      <main>
        <div className={styles.grid}>
          {stopwatches.map(sw => (
            <StopwatchCard
              key={sw.id}
              id={sw.id}
              onDelete={deleteStopwatch}
            />
          ))}
        </div>
      </main>
    </div>
  );
};