import { system, world, BlockPermutation, Direction } from "@minecraft/server";

export const tallPlantComponent = {
  beforeOnPlayerPlace(e) {
    const { permutationToPlace, block, face } = e;

    if (face !== Direction.Up) {
      e.cancel = true;
      return;
    }

    const blockAbove = block.above();
    if (!blockAbove?.isAir) {
      e.cancel = true;
      return;
    }

    system.run(() => {
      blockAbove.setPermutation(
        BlockPermutation.resolve(permutationToPlace.type.id)
          .withState("betterend:upper_block_bit", true)
      );
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

world.afterEvents.playerPlaceBlock.subscribe(ev => {
  const { block, dimension } = ev;
  const perm = block.permutation;

  const isUpperBlockBit = perm.getAllStates()["betterend:upper_block_bit"];
  if (isUpperBlockBit === undefined) return;

  const above = block.above();

  if (above?.isAir) {
    above.setPermutation(
      BlockPermutation.resolve(perm.type.id)
        .withState("betterend:upper_block_bit", true)
    );
  } else {
    const { x, y, z } = block.location;
    dimension.runCommand(`setblock ${x} ${y} ${z} air [] destroy`);
  }
});