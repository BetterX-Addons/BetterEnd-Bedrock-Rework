import { EquipmentSlot, ItemStack } from "@minecraft/server";
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const xpDropComponent = {
    onPlayerBreak({ block, dimension, player }, { params }) {
    const equippable = player?.getComponent("minecraft:equippable");
    if (!equippable) return;
    const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (!itemStack || !itemStack.hasTag("minecraft:is_tool") || !itemStack.hasTag("minecraft:is_pickaxe") || (!itemStack.hasTag("minecraft:iron_tier") && !itemStack.hasTag("minecraft:diamond_tier") && !itemStack.hasTag("minecraft:netherite_tier"))) return;
    const enchantable = itemStack.getComponent("minecraft:enchantable");
    if (enchantable?.getEnchantment("silk_touch")) return;
    const fortuneLevel = enchantable?.getEnchantment("fortune")?.level ?? 0;
    if (params?.drop_item) {
      const baseCount = randomInt(params.min_drop ?? 1, params.max_drop ?? 2);
      const fortuneBonus = fortuneLevel > 0 ? randomInt(0, fortuneLevel) : 0;
      const totalCount = baseCount + fortuneBonus;
      dimension.spawnItem(new ItemStack(params.drop_item, totalCount),
block.location);
    }
    const xpAmount = randomInt(params?.min ?? 1, params?.max ?? 3);
    for (let i = 0; i < xpAmount; i++) {
      dimension.spawnEntity("minecraft:xp_orb", block.location);
    }
  },
};