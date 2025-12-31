import { useState, useCallback, useRef, useEffect } from "react";

// Action Types
export type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" };

export type TodoAction =
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "REMOVE_TODO"; payload: number };

export type DemoAction = CounterAction | TodoAction;

// State Types
export interface CounterState {
  count: number;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  nextId: number;
}

export type DemoType = "counter" | "todo";

// Flow Steps
export type FlowStep =
  | "idle"
  | "action-created"
  | "dispatch-called"
  | "reducer-processing"
  | "state-updated"
  | "components-rerender";

export const FLOW_STEPS: FlowStep[] = [
  "idle",
  "action-created",
  "dispatch-called",
  "reducer-processing",
  "state-updated",
  "components-rerender",
];

export const STEP_LABELS: Record<FlowStep, string> = {
  idle: "Ready",
  "action-created": "1. Action Created",
  "dispatch-called": "2. Dispatch Called",
  "reducer-processing": "3. Reducer Processing",
  "state-updated": "4. State Updated",
  "components-rerender": "5. Components Re-render",
};

export const STEP_DESCRIPTIONS: Record<FlowStep, string> = {
  idle: "Click an action button to start the flow",
  "action-created": "Action object created with type and payload",
  "dispatch-called": "Action sent to store via dispatch()",
  "reducer-processing": "Reducer calculates new state from action",
  "state-updated": "Store updates with new state value",
  "components-rerender": "Subscribed components re-render with new data",
};

// Initial States
const initialCounterState: CounterState = { count: 0 };
const initialTodoState: TodoState = {
  todos: [
    { id: 1, text: "Learn Redux", completed: true },
    { id: 2, text: "Build visualizer", completed: false },
  ],
  nextId: 3,
};

// Reducers
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        todos: [...state.todos, { id: state.nextId, text: action.payload, completed: false }],
        nextId: state.nextId + 1,
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    default:
      return state;
  }
}

export type PlayMode = "manual" | "auto";

export function useReduxDemo() {
  const [demoType, setDemoType] = useState<DemoType>("counter");
  const [counterState, setCounterState] = useState<CounterState>(initialCounterState);
  const [todoState, setTodoState] = useState<TodoState>(initialTodoState);
  const [currentStep, setCurrentStep] = useState<FlowStep>("idle");
  const [currentAction, setCurrentAction] = useState<DemoAction | null>(null);
  const [prevState, setPrevState] = useState<CounterState | TodoState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("auto");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeFlowArrow, setActiveFlowArrow] = useState<number>(-1);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentState = demoType === "counter" ? counterState : todoState;

  // Clear auto-play timer on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, []);

  const resetFlow = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    setCurrentStep("idle");
    setCurrentAction(null);
    setPrevState(null);
    setIsAnimating(false);
    setIsAutoPlaying(false);
    setActiveFlowArrow(-1);
  }, []);

  const applyStateUpdate = useCallback(() => {
    setPrevState(currentState);
    if (demoType === "counter") {
      setCounterState(counterReducer(counterState, currentAction as CounterAction));
    } else {
      setTodoState(todoReducer(todoState, currentAction as TodoAction));
    }
  }, [currentAction, currentState, demoType, counterState, todoState]);

  const advanceToStep = useCallback((step: FlowStep) => {
    const stepIndex = FLOW_STEPS.indexOf(step);

    // Set active arrow (arrow before the current step box)
    setActiveFlowArrow(stepIndex > 0 ? stepIndex - 1 : -1);
    setCurrentStep(step);

    if (step === "components-rerender") {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setIsAutoPlaying(false);
      }, 1000);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (!currentAction || currentStep === "components-rerender") return;

    const currentIndex = FLOW_STEPS.indexOf(currentStep);
    const nextStepValue = FLOW_STEPS[currentIndex + 1];

    if (nextStepValue === "state-updated") {
      applyStateUpdate();
    }

    advanceToStep(nextStepValue);
  }, [currentAction, currentStep, applyStateUpdate, advanceToStep]);

  const autoPlayFlow = useCallback((action: DemoAction, startState: CounterState | TodoState) => {
    setIsAutoPlaying(true);
    setCurrentAction(action);

    const steps: { step: FlowStep; delay: number; applyState?: boolean }[] = [
      { step: "action-created", delay: 0 },
      { step: "dispatch-called", delay: 800 },
      { step: "reducer-processing", delay: 800 },
      { step: "state-updated", delay: 1000, applyState: true },
      { step: "components-rerender", delay: 800 },
    ];

    let totalDelay = 0;
    steps.forEach(({ step, delay, applyState }) => {
      totalDelay += delay;
      autoPlayTimerRef.current = setTimeout(() => {
        if (applyState) {
          setPrevState(startState);
          if (demoType === "counter") {
            setCounterState(counterReducer(startState as CounterState, action as CounterAction));
          } else {
            setTodoState(todoReducer(startState as TodoState, action as TodoAction));
          }
        }
        advanceToStep(step);
      }, totalDelay);
    });
  }, [demoType, advanceToStep]);

  const dispatch = useCallback(
    (action: DemoAction) => {
      // Always reset first
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }

      const stateBeforeAction = demoType === "counter" ? counterState : todoState;

      resetFlow();

      setTimeout(() => {
        if (playMode === "auto") {
          autoPlayFlow(action, stateBeforeAction);
        } else {
          setCurrentAction(action);
          setCurrentStep("action-created");
          setActiveFlowArrow(0);
        }
      }, 50);
    },
    [playMode, resetFlow, autoPlayFlow, demoType, counterState, todoState]
  );

  const switchDemo = useCallback(
    (type: DemoType) => {
      resetFlow();
      setDemoType(type);
    },
    [resetFlow]
  );

  const resetDemo = useCallback(() => {
    resetFlow();
    if (demoType === "counter") {
      setCounterState(initialCounterState);
    } else {
      setTodoState(initialTodoState);
    }
  }, [demoType, resetFlow]);

  const togglePlayMode = useCallback(() => {
    setPlayMode((prev) => (prev === "auto" ? "manual" : "auto"));
  }, []);

  return {
    demoType,
    switchDemo,
    currentState,
    prevState,
    currentStep,
    currentAction,
    dispatch,
    nextStep,
    resetFlow,
    resetDemo,
    isAnimating,
    canAdvance: currentAction !== null && currentStep !== "components-rerender" && !isAutoPlaying,
    playMode,
    togglePlayMode,
    isAutoPlaying,
    activeFlowArrow,
  };
}
