import { narrativeAnnotations } from "../data/narrativeAnnotations.js";
import { MARGIN } from "../index.js";
export const addAnnotations = (state) => {
  // Get svg and remove previous annotations
  const svg = d3.select(".container").select("svg");
  svg.selectAll(".annotation").remove();
  try {
    // Add narrative annotations
    for (const year in narrativeAnnotations) {
      if (
        year >= state.parameters.startYear &&
        year <= state.parameters.endYear
      ) {
        // Remove previous annotations on small screens
        if (window.innerWidth < 1920) {
          state.annotations.shift();
        }
        // Add new annotations
        const newAnnotation = narrativeAnnotations[year];
        state.annotations.push({
          ...newAnnotation,
          x: state.coordinates.x(year),
          y: state.coordinates.y(
            state.data.worldCO2.find((d) => +d.Year === +year)?.CO2
          ),
          connector: {
            end: "arrow",
          },
          note: {
            wrap: 250,
            bgPadding: 10,
            title: year,
            label: newAnnotation.note.label,
          },
        });
      }
    }

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
  } catch (error) {
    console.error("Error adding annotations: ", error);
  }
};
