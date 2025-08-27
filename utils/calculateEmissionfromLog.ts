export function calculateEmissionFromLog(log: {
  transportMode: string;
  distance: number;
  meals: string;
  electricityUsage: number;
  plasticUsed: number;
}): number {
  let emission = 0;

  switch (log.transportMode) {
    case "Car":
      emission += log.distance * 0.21;
      break;
    case "Bike":
      emission += log.distance * 0.02;
      break;
    case "Metro":
      emission += log.distance * 0.05;
      break;
    case "Walk":
    default:
      emission += 0;
      break;
  }

  switch (log.meals) {
    case "Non-Vegetarian":
      emission += 2.5;
      break;
    case "Vegetarian":
      emission += 1.0;
      break;
    case "Vegan":
      emission += 0.8;
      break;
  }

  emission += log.electricityUsage * 0.9;
  emission += log.plasticUsed * 6;

  return parseFloat(emission.toFixed(2));
}