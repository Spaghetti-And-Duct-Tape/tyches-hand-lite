import { createContext, useContext, useState } from "react";

type CommonAnimationTypes = "idle" | "injured" | "healed";
type DaimonOnlyAnimations = "open-eyelid" | "close-eyelid" | "blinking" | "null";
type CardOnlyAnimations = "idle" | "sway" | "discard"

type DaimonAnimationTypes = CommonAnimationTypes | DaimonOnlyAnimations;
type PlayerAnimationTypes = CommonAnimationTypes;

interface AnimationStateType {
  daimon: DaimonAnimationTypes;
  player: PlayerAnimationTypes;
  cards: CardOnlyAnimations;
};

interface AnimationContextType {
  animationState: AnimationStateType;
  setAnimation: <K extends keyof AnimationStateType>(
    key: K,
    value: AnimationStateType[K],
    autoReset?: number
  ) => void;
};

const AnimationStateContext = createContext<AnimationContextType | undefined>(undefined);

const initialAnimationState: AnimationStateType = {
  daimon: "null",
  player: "idle",
  cards: "idle",
};

function AnimationProvider({ children } : { children: React.ReactNode }) {
  const [animationState, animationDispatch] = useState<AnimationStateType>(initialAnimationState);

  function setAnimation<k extends keyof AnimationStateType>(
    key: k, 
    value: AnimationStateType[k], 
    autoReset: number = 1000
  ) {
    animationDispatch(prev => ({ 
      ...prev, 
      [key]: value 
    }));

    setTimeout(() => {
      animationDispatch(prev => 
        ({ 
          ...prev, 
          [key]: "idle" 
        }));
    }, autoReset);
  };

  return (
    <AnimationStateContext.Provider value={{
      animationState,
      setAnimation
    }}>
      { children }
    </AnimationStateContext.Provider>
  )
};

function useAnimationState() {
  const context = useContext(AnimationStateContext);
  if (!context) {
    throw new Error("useAnimationState must be used within AnimationProvider");
  }
  return context;
};

export { AnimationProvider, useAnimationState }