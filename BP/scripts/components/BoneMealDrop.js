import { EquipmentSlot, ItemStack } from "@minecraft/server";

const boneMeal = 'minecraft:bone_meal';
const growthParticle = 'minecraft:crop_growth_emitter';

export const boneMealDropComponent = {
  onPlayerInteract({ block, player, dimension }, { params }) {
    const equipment = player?.getComponent('equippable');
    const item = equipment?.getEquipment(EquipmentSlot.Mainhand);
    if (item?.typeId !== boneMeal) return;

    const dropItem = params.drop_item ?? block.typeId;

    dimension.spawnItem(new ItemStack(dropItem), {
      x: block.location.x + 0.5,
      y: block.location.y + 1,
      z: block.location.z + 0.5
    });

    if (item.amount <= 1) {
      equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
    } else {
      item.amount -= 1;
      equipment?.setEquipment(EquipmentSlot.Mainhand, item);
    }

    dimension.spawnParticle(growthParticle, {
      x: block.location.x + 0.5,
      y: block.location.y,
      z: block.location.z + 0.5
    });
  }
};