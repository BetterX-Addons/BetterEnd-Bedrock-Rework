import { BlockVolume, BlockVolumeBase, Dimension, Entity, Vector3 } from "@minecraft/server";

export class EntityUtils {
    /**
     * @param {Entity} entity
     * @param {string} typeId
     * @param {Dimension} dimension
     * @param {Vector3} location
    */
    constructor(entity) {
        this.entity = entity;
        this.typeId = entity.typeId;
        this.dimension = entity.dimension;
        this.location = entity.location;
    }

    sulphurVariant() {
        if (this.typeId !== 'betterend:cubozoa'/*&& this.typeId !== 'betterend:end_fish'*/) return;
        const events = {
            normal: "betterend:normal",
            sulphur: "betterend:sulphur"
        };
        const groundBlocks = [];
        for (let i = -1; i > -12; i--) {
            const offset = { x: this.location.x, y: this.location.y + i, z: this.location.z };
            const block = this.dimension.getBlockBelow(offset);
            if (!block) continue;
            groundBlocks.push(block);
        }

        const hasVariant = this.entity.getDynamicProperty('betterend:has_variant');
        if (hasVariant) return;

        if (groundBlocks.find(block => block.typeId.includes('brimstone'))) { // falta añadir sulphuric_rock
            this.entity.triggerEvent(events.sulphur);
        } else this.entity.triggerEvent(events.normal);

        this.entity.setDynamicProperty('betterend:has_variant', true);
    }
}