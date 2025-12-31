"use client";

import { Badge, Button, Card, CodeBlock, Column, Heading, Row, Text, ToggleButton } from "@once-ui-system/core";
import { ExperimentComponentProps } from "../index";
import { useReduxDemo, STEP_LABELS, STEP_DESCRIPTIONS } from "./hooks/useReduxDemo";
import styles from "./styles.module.scss";

// Status badge colors
const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  successful: { bg: "success-alpha-weak", text: "success-strong", label: "Successful" },
  "in-progress": { bg: "warning-alpha-weak", text: "warning-strong", label: "In Progress" },
  risky: { bg: "danger-alpha-weak", text: "danger-strong", label: "Risky" },
  destroyed: { bg: "neutral-alpha-weak", text: "neutral-strong", label: "Destroyed" },
  brewing: { bg: "info-alpha-weak", text: "info-strong", label: "Brewing" },
};

export default function ReduxVisualizer({ experiment }: ExperimentComponentProps) {
  const {
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
    canAdvance,
    playMode,
    togglePlayMode,
    isAutoPlaying,
    activeFlowArrow,
  } = useReduxDemo();

  const status = statusConfig[experiment.status] || statusConfig.brewing;

  // Code examples
  const counterReducerCode = `function counterReducer(state, action) {
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
}`;

  const todoReducerCode = `function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        todos: [...state.todos, {
          id: state.nextId,
          text: action.payload,
          completed: false
        }],
        nextId: state.nextId + 1,
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    default:
      return state;
  }
}`;

  return (
    <Column fillWidth gap="32" paddingY="32">
      {/* Header */}
      <Column gap="16">
        <Row gap="12" vertical="center" wrap>
          <Badge
            background={status.bg as any}
            onBackground={status.text as any}
            textVariant="label-default-s"
            paddingX="12"
            paddingY="4"
            arrow={false}
          >
            {status.label}
          </Badge>
          <Badge
            background="success-alpha-weak"
            onBackground="success-strong"
            textVariant="label-default-s"
            paddingX="12"
            paddingY="4"
            arrow={false}
          >
            {experiment.category}
          </Badge>
        </Row>
        <Heading as="h1" variant="display-strong-m">
          {experiment.title}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {experiment.description}
        </Text>
      </Column>

      {/* Controls Row */}
      <Row gap="16" vertical="center" wrap>
        <Row gap="8">
          <ToggleButton
            selected={demoType === "counter"}
            onClick={() => switchDemo("counter")}
            label="Counter"
          />
          <ToggleButton
            selected={demoType === "todo"}
            onClick={() => switchDemo("todo")}
            label="Todo List"
          />
        </Row>
        <Row gap="8">
          <ToggleButton
            selected={playMode === "auto"}
            onClick={togglePlayMode}
            label={playMode === "auto" ? "Auto Play" : "Manual"}
          />
        </Row>
        {playMode === "manual" && (
          <Row gap="8">
            <Button size="s" variant="primary" onClick={nextStep} disabled={!canAdvance}>
              Next Step
            </Button>
            <Button size="s" variant="secondary" onClick={resetFlow}>
              Reset Flow
            </Button>
          </Row>
        )}
        <Button size="s" variant="tertiary" onClick={resetDemo}>
          Reset All
        </Button>
      </Row>

      {/* Current Step Description */}
      <Card radius="m" border="neutral-alpha-weak" background="surface" padding="16">
        <Row gap="12" vertical="center">
          <Badge
            background={currentStep !== "idle" ? "brand-alpha-medium" : "neutral-alpha-weak"}
            onBackground={currentStep !== "idle" ? "brand-strong" : "neutral-medium"}
            textVariant="label-default-s"
            paddingX="12"
            paddingY="4"
            arrow={false}
          >
            {STEP_LABELS[currentStep]}
          </Badge>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {STEP_DESCRIPTIONS[currentStep]}
          </Text>
          {isAutoPlaying && (
            <Badge
              background="success-alpha-weak"
              onBackground="success-strong"
              textVariant="label-default-xs"
              paddingX="8"
              paddingY="4"
              arrow={false}
            >
              Playing...
            </Badge>
          )}
        </Row>
      </Card>

      {/* === REDUX FLOW VISUALIZATION === */}
      <div className={styles.flowContainer}>

        {/* Component UI */}
        <div className={styles.componentSection}>
          <div className={styles.flowLabel}>
            <Text variant="label-default-xs" onBackground="neutral-medium">UI</Text>
          </div>
          <Card
            radius="l"
            border={currentStep === "idle" || currentStep === "components-rerender" ? "success-strong" : "neutral-alpha-weak"}
            background="surface"
            padding="20"
            className={`${styles.flowCard} ${(currentStep === "idle" || currentStep === "components-rerender") ? styles.active : ""} ${isAnimating ? styles.rerendering : ""}`}
          >
            <Column gap="12" horizontal="center">
              <Text variant="heading-strong-s" onBackground="success-strong">Component</Text>
              {demoType === "counter" ? (
                <Column gap="12" horizontal="center">
                  <div className={`${styles.valueDisplay} ${isAnimating ? styles.changing : ""}`}>
                    {(currentState as any).count}
                  </div>
                  <Row gap="8" wrap horizontal="center">
                    <Button size="s" variant="primary" onClick={() => dispatch({ type: "INCREMENT" })} disabled={isAutoPlaying}>+</Button>
                    <Button size="s" variant="secondary" onClick={() => dispatch({ type: "DECREMENT" })} disabled={isAutoPlaying}>-</Button>
                    <Button size="s" variant="tertiary" onClick={() => dispatch({ type: "RESET" })} disabled={isAutoPlaying}>Reset</Button>
                  </Row>
                </Column>
              ) : (
                <Column gap="8" horizontal="center">
                  {(currentState as any).todos.map((todo: any) => (
                    <Text key={todo.id} variant="body-default-s" className={isAnimating ? styles.listItemUpdate : ""} style={{ textDecoration: todo.completed ? "line-through" : "none", opacity: todo.completed ? 0.6 : 1 }}>
                      {todo.completed ? "✓" : "○"} {todo.text}
                    </Text>
                  ))}
                  <Row gap="8" wrap horizontal="center">
                    <Button size="s" variant="primary" onClick={() => dispatch({ type: "ADD_TODO", payload: "New task" })} disabled={isAutoPlaying}>+ Add</Button>
                    <Button size="s" variant="secondary" onClick={() => dispatch({ type: "TOGGLE_TODO", payload: 1 })} disabled={isAutoPlaying}>Toggle</Button>
                  </Row>
                </Column>
              )}
            </Column>
          </Card>
        </div>

        {/* Arrow: Component -> Action */}
        <div className={`${styles.arrow} ${styles.down} ${styles.arrowDown1} ${activeFlowArrow === 0 ? styles.active : ""}`}>▼</div>

        {/* Action Card */}
        <Card
          radius="l"
          border={currentStep === "action-created" ? "accent-strong" : "neutral-alpha-weak"}
          background="surface"
          padding="12"
          className={`${styles.flowCard} ${styles.smallCard} ${styles.actionCard} ${currentStep === "action-created" ? styles.active : ""}`}
        >
          <div className={styles.cardContent}>
            <Text variant="heading-strong-xs" onBackground="accent-strong">Action</Text>
            {currentAction ? (
              <div className={styles.codePreview}>{JSON.stringify(currentAction)}</div>
            ) : (
              <Text variant="body-default-xs" onBackground="neutral-weak">—</Text>
            )}
          </div>
        </Card>

        {/* Arrow: Action -> Dispatch */}
        <div className={`${styles.arrow} ${styles.right} ${styles.arrow1} ${activeFlowArrow === 1 ? styles.active : ""}`}>→</div>

        {/* Dispatch Card */}
        <Card
          radius="l"
          border={currentStep === "dispatch-called" ? "warning-strong" : "neutral-alpha-weak"}
          background="surface"
          padding="12"
          className={`${styles.flowCard} ${styles.smallCard} ${styles.dispatchCard} ${currentStep === "dispatch-called" ? styles.active : ""}`}
        >
          <div className={styles.cardContent}>
            <Text variant="heading-strong-xs" onBackground="warning-strong">Dispatch</Text>
            <div className={styles.codePreview}>dispatch()</div>
          </div>
        </Card>

        {/* Arrow: Dispatch -> Reducer */}
        <div className={`${styles.arrow} ${styles.right} ${styles.arrow2} ${activeFlowArrow === 2 ? styles.active : ""}`}>→</div>

        {/* Reducer Card */}
        <Card
          radius="l"
          border={currentStep === "reducer-processing" ? "info-strong" : "neutral-alpha-weak"}
          background="surface"
          padding="12"
          className={`${styles.flowCard} ${styles.smallCard} ${styles.reducerCard} ${currentStep === "reducer-processing" ? styles.active : ""}`}
        >
          <div className={styles.cardContent}>
            <Text variant="heading-strong-xs" onBackground="info-strong">Reducer</Text>
            <div className={styles.codePreview}>reducer()</div>
          </div>
        </Card>

        {/* Arrow: Reducer -> Store */}
        <div className={`${styles.arrow} ${styles.down} ${styles.arrowDown2} ${activeFlowArrow === 3 ? styles.active : ""}`}>▼</div>

        {/* Store Card */}
        <div className={styles.storeSection}>
          <div className={styles.flowLabel}>
            <Text variant="label-default-xs" onBackground="neutral-medium">STATE</Text>
          </div>
          <Card
            radius="l"
            border={currentStep === "state-updated" ? "brand-strong" : "neutral-alpha-weak"}
            background="surface"
            padding="20"
            className={`${styles.flowCard} ${currentStep === "state-updated" ? styles.active : ""}`}
          >
            <Column gap="12" horizontal="center">
              <Text variant="heading-strong-s" onBackground="brand-strong">Store</Text>
              <Row gap="16" wrap horizontal="center">
                {prevState && currentStep === "state-updated" && (
                  <Column gap="4">
                    <Text variant="label-default-xs" onBackground="neutral-medium">Previous:</Text>
                    <div className={`${styles.stateBox} ${styles.prev}`}>
                      <Text variant="code-default-s">{JSON.stringify(prevState, null, 2)}</Text>
                    </div>
                  </Column>
                )}
                <Column gap="4">
                  <Text variant="label-default-xs" onBackground="neutral-medium">Current:</Text>
                  <div className={`${styles.stateBox} ${currentStep === "state-updated" ? styles.updated : ""}`}>
                    <Text variant="code-default-s">{JSON.stringify(currentState, null, 2)}</Text>
                  </div>
                </Column>
              </Row>
            </Column>
          </Card>
        </div>

        {/* Return: Store -> Component */}
        <div className={`${styles.returnSection}`}>
          <div className={`${styles.returnIndicator} ${activeFlowArrow === 4 ? styles.active : ""}`}>
            <Text variant="label-default-s">↑ Re-render Component</Text>
          </div>
        </div>
      </div>

      {/* Reducer Code Reference */}
      <Card radius="l" border="neutral-alpha-weak" background="surface" padding="24">
        <Column gap="16">
          <Heading variant="heading-strong-s">Reducer Code</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            The reducer is a pure function that takes the current state and an action, then returns the new state.
          </Text>
          <CodeBlock
            compact
            codes={[
              {
                code: demoType === "counter" ? counterReducerCode : todoReducerCode,
                language: "javascript",
                label: "reducer.js",
              },
            ]}
          />
        </Column>
      </Card>

      {/* How It Works */}
      <Card radius="l" border="neutral-alpha-weak" background="surface" padding="24">
        <Column gap="16">
          <Heading variant="heading-strong-s">Redux Data Flow</Heading>
          <Column gap="12">
            <Row gap="12" vertical="start">
              <Badge background="success-alpha-weak" onBackground="success-strong" paddingX="8" paddingY="4" arrow={false}>1</Badge>
              <Column gap="4">
                <Text variant="body-default-s"><strong>User Interaction:</strong> User clicks a button in the UI component</Text>
              </Column>
            </Row>
            <Row gap="12" vertical="start">
              <Badge background="accent-alpha-weak" onBackground="accent-strong" paddingX="8" paddingY="4" arrow={false}>2</Badge>
              <Column gap="4">
                <Text variant="body-default-s"><strong>Action Created:</strong> An action object is created with type and payload</Text>
              </Column>
            </Row>
            <Row gap="12" vertical="start">
              <Badge background="warning-alpha-weak" onBackground="warning-strong" paddingX="8" paddingY="4" arrow={false}>3</Badge>
              <Column gap="4">
                <Text variant="body-default-s"><strong>Dispatch:</strong> The action is sent to the store via dispatch()</Text>
              </Column>
            </Row>
            <Row gap="12" vertical="start">
              <Badge background="info-alpha-weak" onBackground="info-strong" paddingX="8" paddingY="4" arrow={false}>4</Badge>
              <Column gap="4">
                <Text variant="body-default-s"><strong>Reducer:</strong> Store calls the reducer with current state and action</Text>
              </Column>
            </Row>
            <Row gap="12" vertical="start">
              <Badge background="brand-alpha-weak" onBackground="brand-strong" paddingX="8" paddingY="4" arrow={false}>5</Badge>
              <Column gap="4">
                <Text variant="body-default-s"><strong>State Updated:</strong> Store saves the new state returned by reducer</Text>
              </Column>
            </Row>
            <Row gap="12" vertical="start">
              <Badge background="success-alpha-weak" onBackground="success-strong" paddingX="8" paddingY="4" arrow={false}>6</Badge>
              <Column gap="4">
                <Text variant="body-default-s"><strong>Re-render:</strong> Subscribed components receive new state and update UI</Text>
              </Column>
            </Row>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
