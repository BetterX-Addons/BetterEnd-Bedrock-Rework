// States: betterend:color (0-15) + betterend:color_page (0-2)
// page 0 = colors 0-15, page 1 = colors 16-31, page 2 = colors 32-39
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

export const auroraCrystalComponent = {
  beforeOnPlayerPlace(e) {
    const { block } = e;
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
      : 0;

    e.permutationToPlace = setAbsoluteColor(e.permutationToPlace, newAbsolute);
  }
};
