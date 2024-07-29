import { addAnnotations } from "./addAnnotations.js";
import { offsetAnnotations } from "./offsetAnnotations.js";
import { createAxes } from "./createAxes.js";
import { createPaths } from "./createPaths.js";
import { createSVG } from "./createSVG.js";

export const updateChart = (state) => {
  try {
    createSVG(state);
    createAxes(state);
    createPaths(state);
    offsetAnnotations();
    addAnnotations(state);
  } catch (error) {
    console.error("Error updating chart: ", error);
  }
};
