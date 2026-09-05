import { system } from "@minecraft/server";
import { NearbearEvents } from 'woodset/NearbearEvents';


system.beforeEvents.startup.subscribe((init) => {
    init.blockComponentRegistry.registerCustomComponent("betterend:leaves_settings", {
        beforeOnPlayerPlace(e) {
            const { permutationToPlace } = e;
            e.permutationToPlace = permutationToPlace.withState("betterend:persistent_bit", true);
        },

        onRandomTick(e) {
            const { block, dimension } = e;
            const perm = block.permutation;

            if (perm.getState("betterend:persistent_bit") === true) {
                block.setPermutation(perm.withState("betterend:update_bit", false));
                return;
            }

            if (perm.getState("betterend:update_bit") === false) return;

            const maxDistance = 4;

            function isSupportedLeaf(startBlock, visited = new Set(), depth = 0) {
                if (depth > maxDistance) return false;

                const key = `${startBlock.x},${startBlock.y},${startBlock.z}`;
                if (visited.has(key)) return false;
                visited.add(key);

                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dz = -1; dz <= 1; dz++) {
                            if (dx === 0 && dy === 0 && dz === 0) continue;

                            const neighbor = dimension.getBlock({
                                x: startBlock.x + dx,
                                y: startBlock.y + dy,
                                z: startBlock.z + dz,
                            });

                            if (!neighbor) continue;
                            const id = neighbor.typeId;

                            if (id.includes("log")) return true;
                            if (id.includes("leaves")) {
                                if (isSupportedLeaf(neighbor.location, visited, depth + 1))
                                    return true;
                            }
                        }
                    }
                }

                return false;
            }

            if (isSupportedLeaf(block.location)) {
                block.setPermutation(perm.withState("betterend:update_bit", false));
            } else {
                block.setType("minecraft:air");
                activateLeafNeighbors(block, dimension);
            }
        }
    });
});


NearbearEvents.registerBehaviourByEvent("betterend:leaves", {
    onAdjacentPlace(e) {
        const { block } = e;
        if (!block) return;
        block.setPermutation(block.permutation.withState('betterend:update_bit', true));
    },
    onAdjacentBreak(e) {
        const { block } = e;
        if (!block) return;
        block.setPermutation(block.permutation.withState('betterend:update_bit', true));
    },
    onPlace(e) {
        activateLeafNeighbors(e.block, e.dimension);
    }
});


function activateLeafNeighbors(block, dimension) {
    const { x, y, z } = block.location;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                if (dx === 0 && dy === 0 && dz === 0) continue;

                const neighbor = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
                if (!neighbor) continue;

                if (neighbor.hasTag("betterend:leaves")) {
                    try {
                        neighbor.setPermutation(
                            neighbor.permutation.withState("betterend:update_bit", true)
                        );
                    } catch { }
                }
            }
        }
    }
}