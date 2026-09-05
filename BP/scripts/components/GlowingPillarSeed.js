import { EquipmentSlot, BlockPermutation } from "@minecraft/server";

const boneMeal = "minecraft:bone_meal";
const growthParticle = "minecraft:crop_growth_emitter";

const LUMINOPHOR_ID = "betterend:glowing_pillar_luminophor";
const LEAVES_ID = "betterend:glowing_pillar_leaves";
const SEED_ID = "betterend:glowing_pillar_seed";

function spawnParticles(block) {
  const loc = block.location;
  block.dimension.spawnParticle(growthParticle, {
    x: loc.x + 0.5,
    y: loc.y,
    z: loc.z + 0.5
  });
}

function getBlock(dim, x, y, z) {
  try {
    return dim.getBlock({ x, y, z });
  } catch {
    return undefined;
  }
}

function randomLeafState() {
  return Math.floor(Math.random() * 3);
}
const SIDE_FACINGS = [
  { dx:  1, dy: 0, dz:  0, facing: "west"  },
  { dx: -1, dy: 0, dz:  0, facing: "east"  },
  { dx:  0, dy: 0, dz:  1, facing: "north" },
  { dx:  0, dy: 0, dz: -1, facing: "south" }
];

function placeLeaves(dim, x, y, z) {
  for (const { dx, dy, dz, facing } of SIDE_FACINGS) {
    const b = getBlock(dim, x + dx, y + dy, z + dz);
    if (!b || b.typeId !== "minecraft:air") continue;

    b.setPermutation(BlockPermutation.resolve(LEAVES_ID, {
      "minecraft:facing_direction": facing,
      "betterend:random": randomLeafState()
    }));
  }

  const above = getBlock(dim, x, y + 1, z);
  if (!above || above.typeId !== "minecraft:air") return;

  above.setPermutation(BlockPermutation.resolve(LEAVES_ID, {
    "minecraft:facing_direction": "down",
    "betterend:random": randomLeafState()
  }));
}

function growSmall(block) {
  const { x, y, z } = block.location;
  const dim = block.dimension;

  block.setPermutation(
    block.permutation.withState("betterend:growth", 4)
  );

  const luminophorBlock = getBlock(dim, x, y + 1, z);
  if (!luminophorBlock || luminophorBlock.typeId !== "minecraft:air") return;
  luminophorBlock.setType(LUMINOPHOR_ID);

  placeLeaves(dim, x, y + 1, z);
}

function growBig(block) {
  const { x, y, z } = block.location;
  const dim = block.dimension;

  const upperBlock = getBlock(dim, x, y + 1, z);
  if (!upperBlock || upperBlock.typeId !== "minecraft:air") return;

  block.setPermutation(
    block.permutation.withState("betterend:growth", 5)
  );

  upperBlock.setPermutation(
    block.permutation.withState("betterend:growth", 6)
  );

  const luminophorBlock = getBlock(dim, x, y + 2, z);
  if (!luminophorBlock || luminophorBlock.typeId !== "minecraft:air") return;
  luminophorBlock.setType(LUMINOPHOR_ID);

  placeLeaves(dim, x, y + 2, z);
}

function hasSpaceAbove(block, count) {
  // La planta reemplaza la semilla en su misma posición
  // así que solo contamos los bloques ENCIMA de la semilla
  let b = block.above();
  for (let i = 0; i < count; i++) {
    if (!b || b.typeId !== "minecraft:air") return false;
    b = b.above();
  }
  return true;
}

function growIntoPlant(block) {
  // Pequeña: luminophor(+1) + hoja(+2) = 2 libres arriba
  // Grande:  roots_top(+1) + luminophor(+2) + hoja(+3) = 3 libres arriba
  const canGrowSmall = hasSpaceAbove(block, 2);
  const canGrowBig = hasSpaceAbove(block, 3);

  if (!canGrowSmall) return;

  if (canGrowBig && Math.random() < 0.5) {
    growBig(block);
  } else {
    growSmall(block);
  }
}

function tryGrow(block, chance) {
  const growth = block.permutation.getState("betterend:growth");

  if (growth > 3) return;
  if (Math.random() > chance) return;

  if (growth < 3) {
    block.setPermutation(block.permutation.withState("betterend:growth", growth + 1));
  } else {
    growIntoPlant(block);
  }
}

export const glowingPillarSeedComponent = {
  onRandomTick({ block }, { params }) {
    const growth = block.permutation.getState("betterend:growth");
    if (growth > 3) return;

    const chance = params.random_chance ?? 0.5;
    tryGrow(block, chance);
  },

  onPlayerInteract({ block, player }, { params }) {
    const equipment = player?.getComponent("equippable");
    const item = equipment?.getEquipment(EquipmentSlot.Mainhand);
    if (item?.typeId !== boneMeal) return;

    const growth = block.permutation.getState("betterend:growth");
    if (growth > 3) {
      equipment?.setEquipment(EquipmentSlot.Mainhand, item);
      return;
    }

    spawnParticles(block);

    if (player.gameMode !== "creative") {
      if (item.amount <= 1) {
        equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
      } else {
        item.amount -= 1;
        equipment?.setEquipment(EquipmentSlot.Mainhand, item);
      }
    }

    const chance = params.bone_meal_chance ?? 0.5;
    tryGrow(block, chance);
  }
};