import { EquipmentSlot, ItemStack } from "@minecraft/server";
const boneMeal = 'minecraft:bone_meal';
const growthParticle = 'minecraft:crop_growth_emitter';
export const randomPlantComponent = {
  beforeOnPlayerPlace(e, { params }) {
    const permutation = e.permutationToPlace;
    const p = params;
    const maxStates = p.max_states;
    const randomVariant = getRandomVariant(maxStates);
    const newPermutation = permutation.withState('betterend:random', randomVariant);
    e.permutationToPlace = newPermutation;
  },
  onPlayerInteract({ block, player, dimension }, { params }) {
    const p = params;
    const equipment = player?.getComponent('equippable');
    const item = equipment?.getEquipment(EquipmentSlot.Mainhand);
    if (item?.typeId === boneMeal) {
      dimension.spawnItem(new ItemStack(block.typeId), getFixedLocation(block));
      if (item.amount <= 1) {
        equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
      } else {
        item.amount -= 1;
        equipment?.setEquipment(EquipmentSlot.Mainhand, item);
      }
      dimension.spawnParticle(growthParticle, particleLocation(block));
    }
  }
};
function getRandomVariant(maxStates) {
  return Math.floor(Math.random() * maxStates);
}
function getFixedLocation(block) {
  const loc = block.location;
  return {
    x: loc.x + 0.5,
    y: loc.y + 1,
    z: loc.z + 0.5
  };
}
function particleLocation(block) {
  const loc = block.location;
  return {
    x: loc.x + 0.5,
    y: loc.y,
    z: loc.z + 0.5
  };
}