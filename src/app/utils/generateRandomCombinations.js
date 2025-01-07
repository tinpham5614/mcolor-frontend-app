import { colors, shapes } from "../constants/shapes";

const generateRandomCombinations = (count) => {
  const combinations = [];
  const seenCombinations = new Set();

  while (combinations.length < count) {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const combinationKey = `${randomShape}-${randomColor}`;

    if (!seenCombinations.has(combinationKey)) {
      seenCombinations.add(combinationKey); // Mark as seen
      combinations.push({ shape: randomShape, color: randomColor });
    }
  }
  return combinations;
};

export default generateRandomCombinations;
