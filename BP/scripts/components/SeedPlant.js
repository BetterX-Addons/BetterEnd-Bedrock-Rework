import { EquipmentSlot } from "@minecraft/server";
const boneMeal = "minecraft:bone_meal";
const growthParticle = "minecraft:crop_growth_emitter";
export const seedPlantComponent = {
  onRandomTick({ block }, { params }) {
    const max = params.max_size;
    const chance = params.random_chance ?? 0.5;
    const growth = block.permutation.getState("betterend:growth");
    if (growth >= max) return;
    if (Math.random() > chance) return;
    setSize(block, growth);
  },
  onPlayerInteract({ block, player }, { params }) {
    const equipment = player?.getComponent("equippable");
    const item = equipment?.getEquipment(EquipmentSlot.Mainhand);
    if (item?.typeId !== boneMeal) return;
    const growth = block.permutation.getState("betterend:growth");
    const max = params.max_size;
    const chance = params.bone_meal_chance ?? 0.5;
    if (growth >= max) {
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
    if (Math.random() > chance) return;
    setSize(block, growth);
  }
};
function spawnParticles(block) {
  const loc = block.location;
  block.dimension.spawnParticle(growthParticle, {
    x: loc.x + 0.5,
    y: loc.y,
    z: loc.z + 0.5
  });
}

function setSize(block, growth) {
  block.setPermutation(block.permutation.withState("betterend:growth", growth + 1));
}