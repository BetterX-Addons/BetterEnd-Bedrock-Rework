import { world, system } from "@minecraft/server";
import { NearbearEvents } from 'woodset/NearbearEvents';


NearbearEvents.registerBehaviourByEvent("betterend:sapling", {
    item_id: "minecraft:bone_meal",
    onInteract(e, p) {
        const { block, player, itemStack } = e;
        const { tree_feature, offset = [0, 0, 0] } = p;

        if (!tree_feature) return;

        const offset_x = offset[0] ?? 0;
        const offset_y = offset[1] ?? 0;
        const offset_z = offset[2] ?? 0;

        const { x, y, z } = block.center();

        try {
            block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
            block.dimension.placeFeature(tree_feature, {
                x: x + offset_x,
                y: y + offset_y,
                z: z + offset_z
            });

            if (player.getGameMode() !== "Creative") {
                const inventory = player.getComponent("inventory").container;
                if (itemStack.amount > 1) {
                    itemStack.amount -= 1;
                    inventory.setItem(player.selectedSlotIndex, itemStack);
                } else {
                    inventory.setItem(player.selectedSlotIndex, undefined);
                }
            }
        } catch (err) {
            // No se pudo colocar el feature
        }
    }
});
