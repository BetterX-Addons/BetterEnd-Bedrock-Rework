import { system, world } from "@minecraft/server";
import { applyFogAndMusic } from "./biomes/Biomes";
import { seedPlantComponent } from "components/SeedPlant";
import { growingPlantComponent } from "components/GrowingPlant";
import { grassBlockComponent } from "components/GrassBlock";
import { randomPlantComponent } from "components/RandomPlant";
import { xpDropComponent } from "components/XpDrop";
import { umbrellaTreeMembraneComponent } from "components/UmbrellaTreeMembrane";
import { tallPlantComponent } from "components/TallPlant";
import "woodset/WoodSet";

system.beforeEvents.startup.subscribe(e => {
    e.blockComponentRegistry.registerCustomComponent("betterend:growth", seedPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:growing_plant", growingPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:random", randomPlantComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:grass_block", grassBlockComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:xp_drop", xpDropComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:umbrella_tree_membrane", umbrellaTreeMembraneComponent);
    e.blockComponentRegistry.registerCustomComponent("betterend:tall_plant", tallPlantComponent);
});

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    applyFogAndMusic(player);
  }
}, 10);