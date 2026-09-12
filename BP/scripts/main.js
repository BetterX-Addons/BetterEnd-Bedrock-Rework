import { Player, system, world } from "@minecraft/server";
import { applyFogAndMusic } from "./biomes/Biomes";

// ==========================================
// COMPONENTS
// ==========================================

import { seedPlantComponent } from "components/SeedPlant";
import { seedPlantAdvancedComponent } from "components/SeedPlantAdvanced";
import { lanceleafSeedComponent } from "components/LanceleafSeed";
import { glowingPillarSeedComponent } from "components/GlowingPillarSeed";
import { UnderWaterPlantComponent } from "components/UnderWaterPlant";
import { grassBlockComponent } from "components/GrassBlock";
import { randomPlantComponent } from "components/RandomPlant";
import { xpDropComponent } from "components/XpDrop";
import { boneMealDropComponent } from "components/BoneMealDrop";
import { auroraCrystalComponent } from "components/AuroraCrystal";
import { slimeBlockComponent } from "components/SlimeBlock";
import "woodset/WoodSet";
import "external/FallingBlocks/startFalling";

// ==========================================
// UTILS
// ==========================================

import { EntityUtils } from "./utils/EntityUtils";

// ==========================================
// REGISTRATION
// ==========================================

system.beforeEvents.startup.subscribe(e => {
    e.blockComponentRegistry.registerCustomComponent("betterend:aurora_crystal", auroraCrystalComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:underwater_plant", UnderWaterPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:age", seedPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:age_advanced", seedPlantAdvancedComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:lanceleaf_seed", lanceleafSeedComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:glowing_pillar_seed", glowingPillarSeedComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:random", randomPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:grass_block", grassBlockComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:xp_drop", xpDropComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:bonemeal_drop", boneMealDropComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:slime_block", slimeBlockComponent);
});

// ==========================================
// WORLD EVENTS
// ==========================================

system.runInterval(() => {
  const dimensions = [ "overworld", "the_end", "nether" ];
  for (const dimension of dimensions) {
    for (const entity of world.getDimension(dimension).getEntities()) {
      if (entity instanceof Player) {
        // ==========================================
        // PLAYER UTILS
        // ==========================================

        const player = entity;
        applyFogAndMusic(player);
      }
      // ==========================================
      // ENTITY UTILS
      // ==========================================

      const utils = new EntityUtils(entity);
      utils.sulphurVariant();
    }
  }
}, 20);