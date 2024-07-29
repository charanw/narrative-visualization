import { MARGIN } from "../index.js";

// Create paths
export const createPaths = (state) => {
  try {
    let data = state.data.worldCO2;
    let filteredData = state.data.filteredCO2;
    let x = state.coordinates.x;
    let y = state.coordinates.y;

    const co2Path = d3
      .select(".container")
      .select("svg")
      .append("path")
      .attr("transform", `translate(${MARGIN},${MARGIN})`)
      .attr("fill", "none")
      .attr("class", "co2-line")
      .attr("stroke-width", 4)
      .attr("stroke", "red");

    filteredData = data.filter(
      (d) =>
        state.parameters.startYear <= +d.Year &&
        +d.Year <= state.parameters.endYear
    );

    co2Path.datum(filteredData).attr(
      "d",
      d3
        .line()
        .x((d) => x(+d.Year))
        .y((d) => y(+d.CO2))
    );
  } catch (error) {
    console.error("Error creating paths: ", error);
  }
};
