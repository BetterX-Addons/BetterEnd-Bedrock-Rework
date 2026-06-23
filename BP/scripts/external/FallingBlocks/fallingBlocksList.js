/* Remove comments if you prefer
 * For your block to work, add the "isFallingBlock" tag to the block's JSON file
 * and then add it to this list. example >>> "tag:isFallingBlock": {} <<<
 */
export const fallingBlocks = [
    // Each element in the list starts with { and ends with } and each one refers to a falling block. Don't forget to add a comma after each parameter and each element
    {
        identifier: "betterend:endstone_dust",
        entity: "betterend:endstone_dust",
        item: "betterend:endstone_dust",
        particle: "custom:sand_block_particle",
        sound: {
            name: "dig.sand",
            volume: 100,
            pitch: 1,
        },
    },
];
/*
vvv All parameters vvv --- Please note that not all are used at once, depends on the type of falling block. Below you will find what is mandatory or not
{
    identifier: "identifier:here",// < Your falling_block identifier
    entity: "identifier:here",// < The identifier of the entity related to this block
    item: "identifier:here",// < The item that will be dropped when the entity breaks upon falling, To drop the block use the same identifier as it.
    particle: "none",// < The particle when the block breaks after falling, if omitted no particle will appear
    sound: "none",// < The sound when the block breaks after falling, if omitted no sound will appear
    type: "default",// allowed values: "default" / "concrete_powder" / "layers" <<< if the type is omitted or the value is different from that allowed, the default value will be used.
    inWaterBlock: "none",// The block identifier that your falling block will transform into if it is in water. It is only used in the "concrete_powder" type.
    maxLayers: 8,// allowed values: [2..16], only used in "layers" type. This number refers to the quantity of layers the block has, and not the maximum state value. If your state is from 0 to 7 then the value is 8.
    layerState: "block state here (name)",// < the state that indicates the current layer of your block, only used in "layers" type.
    layerProperty: "entity property here (name)"// < The property that indicates how many layers the block was on when it fell, is only used in the layers type and must have the same range as the layerState min == 0, max 1..15
}

* Required fields:
  - all types: identifier, entity
  - concrete_powder: type, inWaterBlock
  - layers: type, maxLayers, layerState, layerProperty
* Optional fields:
  - all types: item, particle, sound
  - default: type
*/
