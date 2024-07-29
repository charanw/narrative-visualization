import { updateScene } from "./functions/updateScene.js";
import {
  handleReset,
  handleNext,
  handleSkip,
  handleToggleAnnotations,
  handleResetZoom,
  handleResize,
  handleBrushzoom,
  handleDetails,
} from "./functions/eventHandlers.js";

export const MARGIN = 100;
export const MESSAGE = `<p>According to the The Intergovernmental Panel on Climate Change, it
            is "unequivocal" that, primarily by greenhhouse gas emissions, human
            activity has caused global warming, leading to "widespread and rapid
            changes in the atmosphere, ocean, cryosphere, and biosphere" with
            "adverse impacts". (IPCC, 2023) This narrative visualization
            explores the evolution of global CO2 (a greenhouse gas) emissions
            and how emissions have been impacted by major world events. Please
            click the next button below to progress through the visualization.</p>`;

// State object
export const state = {
  parameters: {
    scene: 0,
    startYear: 1750,
    endYear: 2021,
    startCO2: 0,
    endCO2: 40,
  },
  dimensions: { width: 1000, height: 1000 },
  coordinates: { x: undefined, y: undefined },
  data: { worldCO2: undefined, filteredCO2: undefined },
  annotations: [],
  detailsOnDemand: [],
};

// State update function
export const setState = (updates) => {
  Object.assign(state, updates);
};

// Initialize
const initialize = async () => {
  let co2Data;
  try {
    // Load data
    co2Data = await d3.csv("./data/annual-co2-emissions-per-country.csv");
  } catch (error) {
    console.error("Error loading data: ", error);
  }
  try {
    // Load data into state object
    setState({
      data: {
        worldCO2: d3
          .filter(co2Data, (d) => d.Entity == "World")
          .map((d) => ({
            ...d,
            CO2: +d["Annual CO₂ emissions"] / 1e9,
          })),
      },
    });

    // Initial chart creation
    updateScene(0);

    // Setup event listeners
    document.getElementById("reset").addEventListener("click", handleReset);
    document.getElementById("next").addEventListener("click", handleNext);
    document.getElementById("skip").addEventListener("click", handleSkip);
    document
      .getElementById("toggle-annotations")
      .addEventListener("click", handleToggleAnnotations);
    document
      .getElementById("toggle-brushzoom")
      .addEventListener("click", handleBrushzoom);
    document
      .getElementById("toggle-details")
      .addEventListener("click", handleDetails);
    document
      .getElementById("reset-zoom")
      .addEventListener("click", handleResetZoom);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.querySelector(".container"));
  } catch (error) {
    console.error("Error: ", error);
  }
};

initialize();
