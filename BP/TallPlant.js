import { system, BlockPermutation, Direction } from "@minecraft/server";

export const tallPlantComponent = {
  beforeOnPlayerPlace(e) {
    const { permutationToPlace, block, face } = e;
    if (face !== Direction.Up) return;
    const blockAbove = block.above();
    if (!blockAbove?.isAir) {
      e.cancel = true;
      return;
    }
    system.run(() => {
      blockAbove.setPermutation(BlockPermutation.resolve(permutationToPlace.type.id).withState("betterend:upper_block_bit", true));
    });
  },
  onBreak(e) {
    const { brokenBlockPermutation, block } = e;
    const isTop = brokenBlockPermutation.getState("betterend:upper_block_bit");
    const id = brokenBlockPermutation.type.id;
    const neighbor = isTop ? block.below() : block.above();
    if (neighbor?.typeId === id) {
      neighbor.setPermutation(BlockPermutation.resolve("minecraft:air"));
    }
  }
};