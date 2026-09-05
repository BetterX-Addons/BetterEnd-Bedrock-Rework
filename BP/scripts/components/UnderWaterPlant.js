export const UnderWaterPlantComponent = {
  beforeOnPlayerPlace(e) {
    const { block } = e;
    if (block.typeId !== 'minecraft:water') {
      e.cancel = true;
    }
  }
};