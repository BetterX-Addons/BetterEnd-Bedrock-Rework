import { Player, system, world } from "@minecraft/server";
import { applyFogAndMusic } from "./biomes/Biomes";
// ==========================================
// COMPONENTS
// ==========================================
import { seedPlantComponent } from "components/SeedPlant";
import { growingPlantComponent } from "components/GrowingPlant";
import { grassBlockComponent } from "components/GrassBlock";
import { randomPlantComponent } from "components/RandomPlant";
import { xpDropComponent } from "components/XpDrop";
import { umbrellaTreeMembraneComponent } from "components/UmbrellaTreeMembrane";
import { tallPlantComponent } from "components/TallPlant";
import { boneMealDropComponent } from "./components/BoneMealDrop";
import { auroraCrystalComponent } from "./components/AuroraCrystal";
import { barrelComponent } from "./components/Barrel";
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
    e.blockComponentRegistry.registerCustomComponent("betterend:growth", seedPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:growing_plant", growingPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:random", randomPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:grass_block", grassBlockComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:xp_drop", xpDropComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:umbrella_tree_membrane", umbrellaTreeMembraneComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:tall_plant", tallPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:bonemeal_drop", boneMealDropComponent);

    // Chest, Barrel
    // e.blockComponentRegistry.registerCustomComponent("betterend:barrel", barrelComponent);
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