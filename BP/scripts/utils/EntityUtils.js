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
        if (this.typeId !== 'betterend:end_fish' || this.typeId !== 'betterend:cubozoa') return;
        const events = {
            normal: "betterend:normal",
            sulphur: "betterend:sulphur"
        };
        const volume = new BlockVolume(from, to)
        const area = this.dimension.getBlocks(volume);
    }
}