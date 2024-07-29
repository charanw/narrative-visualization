import { state } from "../index.js";
import { setState } from "../index.js";
import { updateChart } from "./updateChart.js";
import { setupFreeExploration } from "./setupFreeExploration.js";

import { MESSAGE } from "../index.js";

export const updateScene = (scene) => {
  try {
    // Clear previous annotations
    d3.select("svg").selectAll(".annotation").remove();
    const endYears = [
      1770, 1860, 1914, 1918, 1929, 1939, 1945, 1973, 1979, 1991, 1997, 2008,
      2015, 2020, 2021, 2022,
    ];

    if (scene >= 0 && scene < endYears.length) {
      //Reset UI
      document.getElementById("next").style.display = "block";
      document.getElementById("skip").style.display = "block";
      document.getElementById("reset").style.display = "none";
      document.getElementById("toggle-annotations").style.display = "none";
      document.getElementById("toggle-brushzoom").style.display = "none";
      document.getElementById("toggle-details").style.display = "none";
      document.getElementById("message").innerHTML = MESSAGE;

      //Update state
      setState({
        parameters: {
          scene,
          startYear: 1750,
          endYear: endYears[scene],
          startCO2: 0,
          endCO2: 40,
        },
      });

      //Update chart
      updateChart(state);
    } else if (scene >= endYears.length) {
      //Enable free exploration
      setupFreeExploration(state);
      document.getElementById("message").innerHTML =
        "That's it for this data narration! Feel free to explore the data further with the controls below.";
    }
  } catch (error) {
    console.error("Error updating scene: ", error);
  }
};
