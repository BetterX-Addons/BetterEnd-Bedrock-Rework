const TOTAL_STATES = 40;
const PAGE_SIZE = 16;
function getAbsoluteColor(permutation) {
  const color = permutation.getState('betterend:color');
  const page = permutation.getState('betterend:color_page');
  return page * PAGE_SIZE + color;
}
function setAbsoluteColor(permutation, absolute) {
  const clamped = absolute % TOTAL_STATES;
  const page = Math.floor(clamped / PAGE_SIZE);
  const color = clamped % PAGE_SIZE;
  return permutation
    .withState('betterend:color', color)
    .withState('betterend:color_page', page);
}
function getSeededColor(x, y, z) {
  const hash = Math.abs(((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) | 0);
  return hash % TOTAL_STATES;
}
export const auroraCrystalComponent = {
  beforeOnPlayerPlace(e) {
    const { block } = e;
    const { x, y, z } = block.location;
    const directions = [
      block.above(),
      block.below(),
      block.north(),
      block.south(),
      block.east(),
      block.west()
    ];
    let neighborAbsolute = null;
    for (const neighbor of directions) {
      if (neighbor?.typeId === 'betterend:aurora_crystal') {
        neighborAbsolute = getAbsoluteColor(neighbor.permutation);
        break;
      }
    }
    const newAbsolute = neighborAbsolute !== null
      ? (neighborAbsolute + 1) % TOTAL_STATES
      : getSeededColor(x, y, z);
    e.permutationToPlace = setAbsoluteColor(e.permutationToPlace, newAbsolute);
  }
};