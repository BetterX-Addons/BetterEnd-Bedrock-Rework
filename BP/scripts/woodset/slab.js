import { world, system, BlockPermutation } from "@minecraft/server";
import { NearbearEvents } from "woodset/NearbearEvents";

const adjacentFunction = {
    Down: b => b.above(),
    Up: b => b.below()
};

system.beforeEvents.startup.subscribe((init) => {
    init.blockComponentRegistry.registerCustomComponent("betterend:slab_config", {
        beforeOnPlayerPlace(e, p) {
            const { block, permutationToPlace, face, player } = e;

            if (face !== "Down" && face !== "Up") return;

            const slabBlock = adjacentFunction[face](block);
            const slabBit = slabBlock.permutation.getState("minecraft:vertical_half");
            const slabFullBit = slabBlock.permutation.getState("betterend:block_bit");

            const toPlaceId = permutationToPlace.type.id;
            const blockid = slabBlock.typeId;

            if (
                (face === "Down" && slabBit === 'top' && toPlaceId === blockid) ||
                (face === "Up" && slabBit === 'bottom' && toPlaceId === blockid) && slabFullBit == false
            ) {
                e.cancel = true;
            }
        }
    });
});

NearbearEvents.registerBehaviourByEvent("betterend:slab", {
    customFilter: (itemStack, block, face) => {
        if (itemStack.typeId === block.typeId) {
            const slabBit = block.permutation.getState("minecraft:vertical_half");
            const slabFullBit = block.permutation.getState("betterend:block_bit");
            if (
                (face === "Down" && slabBit === 'top') ||
                (face === "Up" && slabBit === 'bottom') && slabFullBit == false
            ) {
                return true;
            }
        }
        return false;
    },
    onInteract(e, p) {
        const { block, player, itemStack } = e;
        const { placing_sound } = p;

        const location = block.location;
        const dimension = block.dimension;

        // Cambia el state a bloque doble
        dimension.getBlock(location).setPermutation(
            block.permutation.withState("betterend:block_bit", true)
        );

        // Volver a obtener el bloque, la referencia anterior puede quedar obsoleta
        const updatedBlock = dimension.getBlock(location);

        // El slab doble no puede contener agua (liquid_detection lo bloquea),
        // así que si el slab suelto tenía agua, hay que quitarla manualmente.
        try {
            if (updatedBlock && updatedBlock.isWaterlogged) {
                updatedBlock.setWaterlogged(false);
            }
        } catch (err) {
            console.warn("No se pudo quitar el agua del slab doble: " + err);
        }

        if (placing_sound) {
            dimension.playSound(placing_sound, updatedBlock.center());
        }

        if (player.getGameMode() === "Survival") {
            if (itemStack) {
                if (itemStack.amount > 1) {
                    itemStack.amount -= 1;
                    inv.setItem(slot, itemStack);
                } else {
                    inv.setItem(slot, undefined);
                }
            }
        }
    }
});