import { EquipmentSlot, ItemStack, system, world } from "@minecraft/server";
import { Vector } from "./vec3";
class Composter {
  constructor(composter) {
    this.composter = composter;
    this.dimension = composter.dimension;
    this.location = composter.location;
    this.levelId = 'betterend:composter_fill_level';
  }

  getLevel() {
    return this.composter.permutation.getState(this.levelId);
  }

  getCompostableChance(itemStack) {
    return itemStack.getComponent('compostable')?.compostingChance;
  }

  setLevel(level) {
    const newLevel = this.composter.permutation.withState(this.levelId, level);
    this.composter.setPermutation(newLevel);
  }
}

function locKey(dimensionId, loc) {
  return `${dimensionId}|${loc.x},${loc.y},${loc.z}`;
}

const justHarvested = new Set();

system.beforeEvents.startup.subscribe(e => {
  e.blockComponentRegistry.registerCustomComponent('betterend:composter', {
    onPlayerInteract({ block, player }) {
      const composter = new Composter(block);
      const isFull = composter.getLevel() === 8;
      if (!isFull)
        return;

      const boneMeal = new ItemStack('minecraft:bone_meal');
      composter.dimension.spawnItem(boneMeal, Vector.add(composter.location, { x: 0.5, y: 1, z: 0.5 }));
      composter.dimension.playSound('block.composter.empty', composter.location);
      composter.setLevel(0);

      const key = locKey(composter.dimension.id, composter.location);
      justHarvested.add(key);
      system.run(() => justHarvested.delete(key));
    },
    onPlayerBreak({ block, dimension, brokenBlockPermutation }) {
      const level = brokenBlockPermutation.getState('betterend:composter_fill_level');
      if (level !== 8)
        return;

      const boneMeal = new ItemStack('minecraft:bone_meal');
      dimension.spawnItem(boneMeal, Vector.add(block.location, { x: 0.5, y: 1, z: 0.5 }));
    }
  });
});

world.afterEvents.playerInteractWithBlock.subscribe(e => {
  const { block, player, beforeItemStack } = e;
  if (!block.hasTag('betterend:composter') || !beforeItemStack)
    return;

  const key = locKey(block.dimension.id, block.location);
  if (justHarvested.has(key))
    return;

  const composter = new Composter(block);
  if (composter.getLevel() >= 7)
    return;

  const chance = composter.getCompostableChance(beforeItemStack);
  if (!chance)
    return;

  const equipment = player.getComponent('equippable');
  const newAmount = beforeItemStack.amount - 1;
  if (newAmount === 0)
    equipment?.setEquipment(EquipmentSlot.Mainhand, new ItemStack('air'));
  else
    equipment?.setEquipment(EquipmentSlot.Mainhand, new ItemStack(beforeItemStack.typeId, newAmount));

  composter.dimension.spawnParticle('minecraft:crop_growth_emitter', Vector.add(composter.location, { x: 0.5, y: 0.5, z: 0.5 }));

  if (Math.random() < (chance / 100)) {
    const current = composter.getLevel();
    const newLevel = current + 1;
    composter.setLevel(newLevel);
    composter.dimension.playSound('block.composter.fill_success', composter.location);
    if (newLevel === 7) {
      system.runTimeout(() => {
        composter.setLevel(8);
        composter.dimension.playSound('block.composter.ready', composter.location);
      }, 20);
    }
  }
  else
    composter.dimension.playSound('block.composter.fill', composter.location);
});