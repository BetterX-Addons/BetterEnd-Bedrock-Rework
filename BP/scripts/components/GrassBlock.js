import { EquipmentSlot, world, system, GameMode } from "@minecraft/server";

const boneMeal = 'minecraft:bone_meal';
const growthParticle = 'minecraft:crop_growth_area_emitter';

const BLOCK_FEATURES = {
  "betterend:amber_moss": "betterend:bonemeal_amber_moss",
  "betterend:pink_moss": "betterend:bonemeal_pink_moss"
};

const SHOVEL_REPLACEMENTS = {
  "betterend:amber_moss": "betterend:amber_moss_path",
  "betterend:pink_moss": "betterend:pink_moss_path"
};

const cooldown = new Set();

export const grassBlockComponent = {};

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, isFirstEvent, blockFace } = event;
  if (!isFirstEvent || !block || !player) return;

  // ========== COOLDOWN ==========
  if (cooldown.has(player.id)) {
    event.cancel = true;
    return;
  }

  const equipment = player?.getComponent('equippable');
  const item = equipment?.getEquipment(EquipmentSlot.Mainhand);

  if (!item) return;

  const dimension = block.dimension;
  const fixedLocation = getFixedLocation(block);
  const isCreative = player.getGameMode() === GameMode.Creative;

  // ========== BONE MEAL ==========
  if (item.typeId === boneMeal) {
    const feature = BLOCK_FEATURES[block.typeId];
    if (!feature) return;

    event.cancel = true;
    cooldown.add(player.id);

    system.runTimeout(() => {
      dimension.placeFeature(feature, {
        x: block.location.x,
        y: block.location.y + 1,
        z: block.location.z
      });

      // Consumir item
      if (!isCreative) {
        if (item.amount <= 1) {
          equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
        } else {
          item.amount -= 1;
          equipment?.setEquipment(EquipmentSlot.Mainhand, item);
        }
      }

      for (let i = 0; i < 1; i++) {
        const offsetXZ = Math.random();
        dimension.spawnParticle(growthParticle, {
          x: fixedLocation.x,
          y: fixedLocation.y + 1.0,
          z: fixedLocation.z
        });
      }

      dimension.playSound("item.bone_meal.use", fixedLocation);

      // Animaciones
      playHoeAnimation(player);
    });

    system.runTimeout(() => {
      cooldown.delete(player.id);
    }, 3);

    return;
  }

  // ========== SHOVEL ==========
  const isShovel = item.typeId?.includes('_shovel');
  const replacementBlock = SHOVEL_REPLACEMENTS[block.typeId];

  if (replacementBlock && isShovel && blockFace !== "Down") {
    event.cancel = true;
    cooldown.add(player.id);

    system.runTimeout(() => {
      block.setType(replacementBlock);
      dimension.playSound("use.grass", fixedLocation);

      // Reducir durabilidad (solo si no es creativo)
      if (!isCreative) {
        try {
          const durabilityComponent = item.getComponent("minecraft:durability");
          if (durabilityComponent) {
            durabilityComponent.damage += 1;
            equipment?.setEquipment(EquipmentSlot.Mainhand, item);
          }
        } catch (err) {
          console.warn("[GrassBlock] Error al reducir durabilidad:", err);
        }
      }

      // Animaciones
      playHoeAnimation(player);
    });

    system.runTimeout(() => {
      cooldown.delete(player.id);
    }, 3);
  }
});

function getFixedLocation(block) {
  const loc = block.location;
  return {
    x: loc.x + 0.5, 
    y: loc.y,
    z: loc.z + 0.5 
  };
}

function playHoeAnimation(player) {
  try {
    player.playAnimation("animation.humanoid.use_hoe", {
      stopExpression: "q.all_animations_finished || v.is_first_person",
      controller: "controller.animation.humanoid.use_hoe"
    });

    player.playAnimation("animation.humanoid.use_hoe.first_person", {
      stopExpression: "q.all_animations_finished || !v.is_first_person",
      controller: "controller.animation.humanoid.use_hoe.first_person"
    });
  } catch (err) {
    console.warn("[GrassBlock] Error al reproducir animaciones:", err);
  }
}