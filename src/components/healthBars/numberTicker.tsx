//External Imports
import { useEffect } from "react"

export default function NumberTicker({ 
  replacement,
  duration = 1700,
  value,
  setValue, 
}: { 
  replacement: number;
  duration?: number;
  value: number;
  setValue: (value: number) => void;
}) {
  
  useEffect(() => {
      if (value === replacement) return;

      const delta = replacement - value;
      const steps = 30;
      const stepTime = duration / steps;
  
      let currentStep = 0;
  
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const next = Math.round(value + delta * progress);
  
        setValue(next);
  
        if (currentStep >= steps) {
          clearInterval(interval);
          setValue(replacement); // ensure it's exact
        }
      }, stepTime);
  
      return () => clearInterval(interval);
    }, [replacement]);

  return(
    <>{ value }</>
  )
};