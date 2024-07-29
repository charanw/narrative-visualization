import { narrativeAnnotations } from "../data/narrativeAnnotations.js";
// Function to adjust final annotation positions for small screens
export const offsetAnnotations = () => {
  try {
    const offsets =
      window.innerWidth < 1920
        ? {
            2020: { dx: -50, dy: 50 },
            2021: { dx: -50, dy: 50 },
            2022: { dx: -50, dy: 50 },
          }
        : {
            2020: { dx: 0, dy: 215 },
            2021: { dx: 100, dy: 150 },
            2022: { dx: 100, dy: 0 },
          };

    Object.keys(narrativeAnnotations).forEach((year) => {
      if (offsets[year]) {
        narrativeAnnotations[year].dx = offsets[year].dx;
        narrativeAnnotations[year].dy = offsets[year].dy;
      }
    });
  } catch (error) {
    console.error("Error offseting annotations: ", error);
  }
};
