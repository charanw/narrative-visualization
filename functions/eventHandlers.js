import { state } from "../index.js";
import { setState } from "../index.js";
import { updateChart } from "./updateChart.js";
import { updateScene } from "./updateScene.js";
import { MARGIN } from "../index.js";
import { addAnnotations } from "./addAnnotations.js";

//Toggle variables
let toggleAnnotations = 0;
let toggleDetails = 0;

// Handle reset button
export const handleReset = () => {
  setState({ annotations: [] });
  toggleAnnotations = 0;
  toggleDetails = 0;
  document.getElementById("toggle-annotations").innerHTML =
    "Disable Annotations";
  updateScene(0);
};

// Handle next button
export const handleNext = () => {
  const newScene = state.parameters.scene + 1;
  setState({
    parameters: { scene: newScene },
    annotations: [],
  });
  updateScene(newScene);
};

// Handle skip button
export const handleSkip = () => {
  setState({ parameters: { scene: 17 }, annotations: [] });
  updateScene(17);
};

// Handle resize
export const handleResize = ([entry]) => {
  console.log(entry);
  const height = entry.contentRect.height;
  const width = entry.contentRect.width;

  setState({
    dimensions: {
      height: height - MARGIN * 2,
      width: width - MARGIN * 2,
    },
    annotations: [],
  });

  //Reset toggle variables
  toggleAnnotations = 0;
  toggleDetails = 0;

  // Update UI
  document.getElementById("toggle-annotations").innerHTML =
    "Disable Annotations";
  document.getElementById("toggle-details").innerHTML = "Enable Details";

  // Update UI
  updateChart(state);
};

// Handle toggle annotations button
export const handleToggleAnnotations = () => {
  const svg = d3.select(".container").select("svg");
  const toggleButton = document.getElementById("toggle-annotations");
  if (toggleAnnotations % 2 === 0) {
    // Remove annotations
    svg.selectAll(".annotation").remove();
    toggleButton.innerHTML = "Enable Annotations";
  } else {
    // Create annotation object
    const annotations = d3
      .annotation()
      .annotations(state.annotations)
      .type(d3.annotationCallout);

    // Add new annotations
    svg
      .append("g")
      .attr("class", "annotation")
      .attr("transform", `translate(${MARGIN},${MARGIN})`)
      .call(annotations);
    toggleButton.innerHTML = "Disable Annotations";
  }
  toggleAnnotations += 1;
};

// Handle toggle brush zoom button
export const handleBrushzoom = () => {
  const svg = d3.select(".container").select("svg");
  // Update UI
  document.getElementById("toggle-brushzoom").style.display = "none";
  const g = svg.append("g").attr("class", "brush-zoom");

  // Handle brushing event
  const handleBrush = (event) => {
    // Hide zoom button until zoom is complete
    document.getElementById("reset-zoom").style.display = "block";
    if (event.selection) {
      const [[startYear, startCO2], [endYear, endCO2]] = event.selection;
      setState({
        parameters: {
          startYear: state.coordinates.x.invert(startYear - MARGIN),
          endYear: state.coordinates.x.invert(endYear - MARGIN),
          startCO2: state.coordinates.y.invert(endCO2 - MARGIN),
          endCO2: state.coordinates.y.invert(startCO2 - MARGIN),
        },
        annotations: [],
      });
      // Redraw chart and annotations
      updateChart(state);
      addAnnotations(state);
      // Display zoom button again
      document.getElementById("toggle-brushzoom").style.display = "block";
    }
  };

  // Create brush object
  const brush = d3
    .brush()
    .extent([
      [0 + MARGIN, 0],
      [state.dimensions.width, state.dimensions.height + MARGIN],
    ])
    .on("end", handleBrush);

  // Add brush
  g.append("g").call(brush).attr("class", "brush-zoom");
};

// Handle reset zoom button
export const handleResetZoom = () => {
  setState({ annotations: [] });
  toggleAnnotations = 0;
  toggleDetails = 0;
  document.getElementById("reset-zoom").style.display = "none";
  document.getElementById("toggle-annotations").innerHTML =
    "Disable Annotations";
  updateScene(17);
};

// Handle details on demand popup
export const handleDetails = () => {
  const svg = d3.select(".container").select("svg");
  if (toggleDetails % 2 === 0) {
    // Update UI
    document.getElementById("toggle-details").innerHTML = "Disable Details";
    const guidelines = svg.append("g").attr("class", "guide-lines");
    // Create line objects
    const vertLine = guidelines
      .append("line")
      .attr("class", "vertical-line")
      .attr("stroke-width", 1)
      .style("visibility", "hidden");

    const horizLine = guidelines
      .append("line")
      .attr("class", "horizontal-line")
      .attr("stroke-width", 1)
      .style("visibility", "hidden");

    const intersectionPoint = guidelines
      .append("circle")
      .attr("class", "intersection-point");

    // Format function for CO2 popup
    const format = d3.format(",");

    // Handle mousemove
    svg.on("mousemove", (event) => {
      // Get mouse position and find corresponding year and CO2
      const [mouseX] = d3.pointer(event);
      const selectedYear = Math.round(
        state.coordinates.x.invert(mouseX - MARGIN)
      );

      const selectedCO2 = state.data.worldCO2.find(
        (d) => +d.Year === +selectedYear
      );
      // If there is a corresponding CO2, create annotation
      if (selectedCO2) {
        const annotation = {
          x: state.coordinates.x(selectedYear),
          y: state.coordinates.y(selectedCO2.CO2),
          dx: 50,
          dy: -10,
          connector: {
            end: "arrow",
          },
          note: {
            wrap: 250,
            bgPadding: 20,
            title: selectedYear,
            label: format(selectedCO2.CO2 * 10e7) + " metric tonnes of CO2",
          },
        };

        // Remove previous annotation if it exists
        if (state.detailsOnDemand.length) {
          state.detailsOnDemand.pop();
        }

        // Add annotation to array
        state.detailsOnDemand.push(annotation);

        // Create annotation object
        const annotations = d3
          .annotation()
          .annotations(state.detailsOnDemand)
          .type(d3.annotationCallout);

        // Remove previous annotation
        svg.selectAll(".details-annotation").remove();

        // Add annotation
        svg
          .append("g")
          .attr("class", "details-annotation")
          .attr("transform", `translate(${MARGIN},${MARGIN})`)
          .call(annotations);

        // Add vertical guideline
        vertLine
          .attr("x1", state.coordinates.x(selectedYear) + MARGIN)
          .attr("x2", state.coordinates.x(selectedYear) + MARGIN)
          .attr("y1", state.dimensions.height + MARGIN)
          .attr("y2", state.coordinates.y(selectedCO2.CO2) + MARGIN)
          .style("visibility", "visible");

        // Add horizontal guideline
        horizLine
          .attr("x1", MARGIN)
          .attr("x2", state.coordinates.x(selectedYear) + MARGIN)
          .attr("y1", state.coordinates.y(selectedCO2.CO2) + MARGIN)
          .attr("y2", state.coordinates.y(selectedCO2.CO2) + MARGIN)
          .style("visibility", "visible");

        // Add intersection point marker
        intersectionPoint
          .attr("cx", state.coordinates.x(selectedYear) + MARGIN)
          .attr("cy", state.coordinates.y(selectedCO2.CO2) + MARGIN)
          .attr("r", 5)
          .attr("fill", "white");
      }
    });
  } else {
    // Update UI
    document.getElementById("toggle-details").innerHTML = "Enable Details";

    // Remove guidelines, detail annotations, and mousemove listener
    d3.selectAll(".guide-lines").remove();
    d3.selectAll(".details-annotation").remove();
    svg.on("mousemove", null);
  }
  toggleDetails += 1;
};
