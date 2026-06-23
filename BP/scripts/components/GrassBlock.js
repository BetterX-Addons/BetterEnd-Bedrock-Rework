import { EquipmentSlot, world, system } from "@minecraft/server";
const boneMeal = 'minecraft:bone_meal';
const growthParticle = 'minecraft:crop_growth_emitter';
export const grassBlockComponent = {};
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, isFirstEvent } = event;
  if (!isFirstEvent || !block || !player) return;
  const comp = block.getComponent("betterend:grass_block");
  if (!comp) return;
  const p = comp.customComponentParameters.params;
  const feature = p.feature;
  const shovelBlock = p.shovel_block;
  const equipment = player?.getComponent('equippable');
  const item = equipment?.getEquipment(EquipmentSlot.Mainhand);
  const fixedLocation = getFixedLocation(block);
  if (item?.typeId === boneMeal && feature) {
    event.cancel = true;
    system.runTimeout(() => {
      const dimension = block.dimension;
      dimension.placeFeature(feature, block.location);
      if (item.amount <= 1) {
        equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
      } else {
        item.amount -= 1;
        equipment?.setEquipment(EquipmentSlot.Mainhand, item);
      }
      for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetZ = (Math.random() - 0.5) * 2;
        dimension.spawnParticle(growthParticle, {
          x: fixedLocation.x + offsetX,
          y: fixedLocation.y,
          z: fixedLocation.z + offsetZ
        });
      }
      dimension.spawnParticle(growthParticle, fixedLocation);
    });
    return;
  }
  if (shovelBlock && isShovel(item?.typeId)) {
    system.runTimeout(() => {
      block.setType(shovelBlock);
      player.playSound('use.grass', {
        location: block.location,
        volume: 1.0,
        pitch: 0.8
      });
    });
  }
});
function isShovel(typeId) {
  if (!typeId) return false;
  return typeId.includes('_shovel');
}
function getFixedLocation(block) {
  const loc = block.location;
  return { x: loc.x + 0.5, y: loc.y, z: loc.z + 0.5 };
}
