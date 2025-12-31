import { ComponentType } from "react";
import { LabExperiment } from "@/types";
import ReduxVisualizer from "./redux-visualizer";

export interface ExperimentComponentProps {
  experiment: LabExperiment;
}

export const experimentComponents: Record<string, ComponentType<ExperimentComponentProps>> = {
  "redux-visualizer": ReduxVisualizer,
};
