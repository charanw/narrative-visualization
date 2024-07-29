import { MARGIN } from "../index.js";
import { setState } from "../index.js";

export const createAxes = (state) => {
  try {
    let width = state.dimensions.width;
    let height = state.dimensions.height;

    // Create scales
    const x = d3
      .scaleLinear()
      .domain([
        state.parameters.startYear,
        // Add extra space on x-axis for annotations at the end of visualization, otherwise just use the end year
        [14, 15, 16, 17].includes(state.parameters.scene)
          ? 2090
          : state.parameters.endYear,
      ])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([state.parameters.startCO2, state.parameters.endCO2])
      .range([height, 0]);

    setState({ coordinates: { x, y } });

    // Create axes
    const svg = d3.select(".container").select("svg");
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${MARGIN},${height + MARGIN})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${MARGIN},${MARGIN})`)
      .call(d3.axisLeft(y));

    // Create x-axis label
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 + MARGIN)
      .attr("y", height + MARGIN + 50)
      .text("Year");

    // Create y-axis label
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", -height / 2 - MARGIN * 2)
      .attr("y", MARGIN - 50)
      .attr("transform", "rotate(-90)")
      .text("Emissions GtCO2 (Billions of metric tonnes)");
  } catch (error) {
    console.error("Error creating axes: ", error);
  }
};
