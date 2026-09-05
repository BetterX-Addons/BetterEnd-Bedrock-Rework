import { system, world } from "@minecraft/server";
import { Vector } from "./vec3";
class Chest {
    constructor(chest) {
        this.chest = chest;
        this.dimension = chest.dimension;
        this.location = chest.location;
        this.chestId = 'betterend:open';
    }
    isOpen() {
        return this.chest.permutation.getState(this.chestId);
    }
    getInventoryEntity() {
        const { x, y, z } = this.chest.location;
        const entity = world.getDynamicProperty(`chest:${x}:${y}:${z}:${this.dimension.id}`);
        return world.getEntity(entity);
    }
    spawnChestInventory() {
        const { x, y, z } = this.chest.location;
        const inventory = this.dimension.spawnEntity('betterend:chest', Vector.add(this.chest.location, { x: 0.5, y: 0, z: 0.5 }));
        inventory.nameTag = "Chest";
        world.setDynamicProperty(`chest:${x}:${y}:${z}:${this.dimension.id}`, inventory.id);
    }
    openChest() {
        this.chest.dimension.playSound('random.chestopen', this.chest.location);
        let i = 0;
        const interval = system.runInterval(() => {
            const open = this.chest.permutation.withState(this.chestId, i);
            this.chest.setPermutation(open);
            if (i >= 6) {
                system.clearRun(interval);
                return;
            }
            i++;
        });
    }
    closeChest() {
        this.chest.dimension.playSound('random.chestclosed', this.chest.location);
        let i = 6;
        const interval = system.runInterval(() => {
            const open = this.chest.permutation.withState(this.chestId, i);
            this.chest.setPermutation(open);
            if (i <= 0) {
                system.clearRun(interval);
                return;
            }
            i--;
        });
    }
    removeInventory() {
        const { x, y, z } = this.chest.location;
        const inventoryEntity = this.getInventoryEntity();
        const inv = inventoryEntity?.getComponent('inventory')?.container;
        for (let i = 0; i < inv?.size; i++) {
            const item = inv.getItem(i);
            if (!item)
                continue;
            this.dimension.spawnItem(item, Vector.add(this.location, { x: 0.5, y: 0.5, z: 0.5 }));
        }
        inventoryEntity?.remove();
        world.setDynamicProperty(`chest:${x}:${y}:${z}:${this.dimension.id}`, undefined);
    }
}
system.beforeEvents.startup.subscribe(e => {
    e.blockComponentRegistry.registerCustomComponent('betterend:chest', {
        onPlace({ block }) {
            const chest = new Chest(block);
            chest.spawnChestInventory();
        },
        onBreak({ block }) {
            const chest = new Chest(block);
            chest.removeInventory();
        }
    });
});
world.afterEvents.entityContainerClosed.subscribe(e => {
    const { entity } = e;
    if (entity.typeId !== 'betterend:chest')
        return;
    const block = entity.dimension.getBlock(entity.location);
    if (!block)
        return;
    if (block.hasTag('betterend:chest')) {
        const chest = new Chest(block);
        if (chest.isOpen())
            chest.closeChest();
    }
});
world.afterEvents.entityContainerOpened.subscribe(e => {
    const { entity } = e;
    if (entity.typeId !== 'betterend:chest')
        return;
    const block = entity.dimension.getBlock(entity.location);
    if (!block)
        return;
    if (block.hasTag('betterend:chest')) {
        const chest = new Chest(block);
        if (chest.isOpen())
            return;
        chest.openChest();
    }
});
