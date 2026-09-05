import { system, world } from "@minecraft/server";
import { Vector } from "./vec3";
class Barrel {
    constructor(barrel) {
        this.barrel = barrel;
        this.dimension = barrel.dimension;
        this.location = barrel.location;
        this.barrelId = 'betterend:open';
    }
    isOpen() {
        return this.barrel.permutation.getState(this.barrelId);
    }
    getInventoryEntity() {
        const { x, y, z } = this.barrel.location;
        const entity = world.getDynamicProperty(`barrel:${x}:${y}:${z}:${this.dimension.id}`);
        return world.getEntity(entity);
    }
    spawnBarrelInventory() {
        const { x, y, z } = this.barrel.location;
        const inventory = this.dimension.spawnEntity('betterend:barrel', Vector.add(this.barrel.location, { x: 0.5, y: 0, z: 0.5 }));
        inventory.nameTag = "Barrel";
        world.setDynamicProperty(`barrel:${x}:${y}:${z}:${this.dimension.id}`, inventory.id);
    }
    openBarrel() {
        const open = this.barrel.permutation.withState(this.barrelId, true);
        this.barrel.setPermutation(open);
        this.barrel.dimension.playSound('block.barrel.open', this.barrel.location);
    }
    closeBarrel() {
        const close = this.barrel.permutation.withState(this.barrelId, false);
        this.barrel.setPermutation(close);
        this.barrel.dimension.playSound('block.barrel.close', this.barrel.location);
    }
    removeInventory() {
        const { x, y, z } = this.barrel.location;
        const inventoryEntity = this.getInventoryEntity();
        const inv = inventoryEntity?.getComponent('inventory')?.container;
        for (let i = 0; i < inv?.size; i++) {
            const item = inv.getItem(i);
            if (!item)
                continue;
            this.dimension.spawnItem(item, Vector.add(this.location, { x: 0.5, y: 0.5, z: 0.5 }));
        }
        inventoryEntity?.remove();
        world.setDynamicProperty(`barrel:${x}:${y}:${z}:${this.dimension.id}`, undefined);
    }
}
system.beforeEvents.startup.subscribe(e => {
    e.blockComponentRegistry.registerCustomComponent('betterend:barrel', {
        onPlace({ block }) {
            const barrel = new Barrel(block);
            barrel.spawnBarrelInventory();
        },
        onBreak({ block }) {
            const barrel = new Barrel(block);
            barrel.removeInventory();
        }
    });
});
world.afterEvents.entityContainerClosed.subscribe(e => {
    const { entity } = e;
    if (entity.typeId !== 'betterend:barrel')
        return;
    const block = entity.dimension.getBlock(entity.location);
    if (!block)
        return;
    if (block.hasTag('betterend:barrel')) {
        const barrel = new Barrel(block);
        if (barrel.isOpen())
            barrel.closeBarrel();
    }
});
world.afterEvents.entityContainerOpened.subscribe(e => {
    const { entity } = e;
    if (entity.typeId !== 'betterend:barrel')
        return;
    const block = entity.dimension.getBlock(entity.location);
    if (!block)
        return;
    if (block.hasTag('betterend:barrel')) {
        const barrel = new Barrel(block);
        if (barrel.isOpen())
            return;
        barrel.openBarrel();
    }
});