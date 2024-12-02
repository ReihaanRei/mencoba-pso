export function tspDistance(route, distances) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        totalDistance += distances[route[i]][route[i + 1]];
    }
    totalDistance += distances[route[route.length - 1]][route[0]]; // Return to start
    return totalDistance;
}