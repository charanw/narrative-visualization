import { MARGIN } from "../index.js";

export const createSVG = (state) => {
  
  try {
    // Get container
    const container = d3.select(".container");

    // Remove previous SVG if it exists
    if (container.select("svg").node() != null) {
      container.select("svg").remove();
    }

    // Create SVG element
    container
      .append("svg")
      .attr("width", state.dimensions.width + MARGIN * 2)
      .attr("height", state.dimensions.height + MARGIN * 2);
  } catch (error) {
    console.error("Error creating SVG: ", error);
  }
};
