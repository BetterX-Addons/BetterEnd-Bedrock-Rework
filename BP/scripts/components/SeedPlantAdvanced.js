import { EquipmentSlot, GameMode, system } from "@minecraft/server";

const boneMeal = "minecraft:bone_meal";
const growthParticle = "minecraft:crop_growth_emitter";

export const seedPlantAdvancedComponent = {
  onRandomTick({ block }, { params }) {
    const max = params.max_size;
    const chance = params.random_chance ?? 0.5;
    const growth = block.permutation.getState("betterend:growth");
    if (growth >= max - 1) return;
    if (Math.random() > chance) return;
    setSize(block, growth);
  },
  onPlayerInteract({ block, player }, { params }) {
    const equipment = player?.getComponent("equippable");
    const item = equipment?.getEquipment(EquipmentSlot.Mainhand);
    if (item?.typeId !== boneMeal) return;

    const isCreative = player.getGameMode() === GameMode.Creative;
    const growth = parseInt(block.permutation.getState("betterend:growth"));
    const max = params.max_size;
    const chance = params.bone_meal_chance ?? 0.5;
    const feature = params.feature_on_max;

    console.warn(`[SeedPlant] Growth: ${growth}, Max: ${max}, Feature: ${feature}`);

    spawnParticles(block);

    if (!isCreative) {
      if (item.amount <= 1) {
        equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
      } else {
        item.amount -= 1;
        equipment?.setEquipment(EquipmentSlot.Mainhand, item);
      }
    }

    // Si ya está en max_size, generar feature
    if (growth >= max - 1) {
      console.warn(`[SeedPlant] Intentando colocar feature: ${feature}`);
      if (feature) {
        system.runTimeout(() => {
          try {
            block.dimension.placeFeature(feature, {
              x: block.location.x,
              y: block.location.y + 1,
              z: block.location.z
            });
            console.warn(`[SeedPlant] Feature colocada: ${feature}`);
          } catch (err) {
            console.error(`[SeedPlant] Error al colocar feature:`, err);
          }
        });
      }
      return;
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
  const nextGrowth = parseInt(growth) + 1;
  block.setPermutation(block.permutation.withState("betterend:growth", nextGrowth));
}