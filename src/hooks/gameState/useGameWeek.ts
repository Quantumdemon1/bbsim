
import { useState } from 'react';

export function useGameWeek() {
  const [currentWeek, setCurrentWeek] = useState(1);
  
  return {
    currentWeek,
    setCurrentWeek,
  };
}
