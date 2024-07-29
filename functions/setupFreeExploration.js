import { setState } from "../index.js";
import { updateChart } from "./updateChart.js";

export const setupFreeExploration = (state) => {
  //Update UI
  document.getElementById("next").style.display = "none";
  document.getElementById("skip").style.display = "none";
  document.getElementById("reset").style.display = "block";
  document.getElementById("toggle-annotations").style.display = "block";
  document.getElementById("toggle-brushzoom").style.display = "block";
  document.getElementById("toggle-details").style.display = "block";

  //Update state
  setState({
    parameters: {
      scene: 17,
      startYear: 1750,
      endYear: 2090,
      startCO2: 0,
      endCO2: 40,
    },
  });

  //Update chart
  updateChart(state);
};
