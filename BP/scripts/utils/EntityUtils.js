import { BlockVolume, BlockVolumeBase, Dimension, Entity } from "@minecraft/server";
export class EntityUtils {
  constructor(entity) {
    this.entity = entity;
    this.typeId = entity.typeId;
    this.dimension = entity.dimension;
    this.location = entity.location;
  }
  sulphurVariant() {
    if (this.typeId !== 'betterend:cubozoa') return
    const events = {
      normal: "betterend:normal",
      sulphur: "betterend:sulphur"
    };
    const groundBlocks = [];
    for (let i = -1; i > -12; i--) {
      const offset = {
        x: this.location.x,
        y: this.location.y + i,
        z: this.location.z };
        const block = this.dimension.getBlockBelow(offset);
        if (!block) continue;
        groundBlocks.push(block);
    }
    const hasVariant = this.entity.getDynamicProperty('betterend:has_variant');
    if (hasVariant) return;
    if (groundBlocks.find(block => block.typeId.includes('brimstone'))) {
      this.entity.triggerEvent(events.sulphur);
    }
    else this.entity.triggerEvent(events.normal);
    this.entity.setDynamicProperty('betterend:has_variant', true);
  }
}