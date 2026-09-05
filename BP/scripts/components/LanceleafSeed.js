import { EquipmentSlot, BlockPermutation } from "@minecraft/server";

const boneMeal = "minecraft:bone_meal";
const growthParticle = "minecraft:crop_growth_emitter";
const BLOCK_ID = "betterend:lanceleaf_seed";

function spawnParticles(block) {
  const loc = block.location;
  block.dimension.spawnParticle(growthParticle, {
    x: loc.x + 0.5,
    y: loc.y,
    z: loc.z + 0.5
  });
}

// Destruye toda la planta grande buscando desde el bloque roto
// hacia arriba y abajo mientras sea el mismo bloque con growth >= 4
function destroyPlant(block) {
  const air = BlockPermutation.resolve("minecraft:air");

  // Buscar hacia abajo
  let b = block.below();
  while (b && b.typeId === BLOCK_ID) {
    const g = b.permutation.getState("betterend:growth");
    if (g < 4) break;
    const next = b.below();
    b.setPermutation(air);
    b = next;
  }

  // Buscar hacia arriba
  b = block.above();
  while (b && b.typeId === BLOCK_ID) {
    const g = b.permutation.getState("betterend:growth");
    if (g < 4) break;
    const next = b.above();
    b.setPermutation(air);
    b = next;
  }
}

function growIntoPlant(block) {
  const loc = block.location;
  const dim = block.dimension;

  const noMiddle = Math.random() < 0.2;

  let column;
  if (noMiddle) {
    column = [4, 5, 7, 8];
  } else {
    const middleCount = Math.floor(Math.random() * 2) + 1;
    column = [4, 5, ...Array(middleCount).fill(6), 7, 8];
  }

  for (let i = 0; i < column.length; i++) {
    const targetBlock = dim.getBlock({
      x: loc.x,
      y: loc.y + i,
      z: loc.z
    });

    if (!targetBlock) return;

    targetBlock.setPermutation(
      block.permutation.withState("betterend:growth", column[i])
    );
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

export const lanceleafSeedComponent = {
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

    if (item.amount <= 1) {
      equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
    } else {
      item.amount -= 1;
      equipment?.setEquipment(EquipmentSlot.Mainhand, item);
    }

    const chance = params.bone_meal_chance ?? 0.5;
    tryGrow(block, chance);
  },

  onBreak({ block, brokenBlockPermutation }) {
    const growth = brokenBlockPermutation.getState("betterend:growth");
    if (growth < 4) return;
    destroyPlant(block);
  }
};