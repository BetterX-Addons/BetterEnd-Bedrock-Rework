export const randomPlantComponent = {
  beforeOnPlayerPlace(e, { params }) {
    const permutation = e.permutationToPlace;
    const p = params;
    const maxStates = p.max_states;
    const loc = e.block.location;
    const seededVariant = getSeededVariant(loc.x, loc.y, loc.z, maxStates);
    const newPermutation = permutation.withState('betterend:random', seededVariant);
    e.permutationToPlace = newPermutation;
  }
};
function getSeededVariant(x, y, z, maxStates) {
  const hash = Math.abs((x * 73856093) ^ (y * 19349663) ^ (z * 83492791));
  return hash % maxStates;
}