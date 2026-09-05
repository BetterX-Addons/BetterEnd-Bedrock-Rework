import { world, system, EntityDamageCause } from '@minecraft/server';

const LADDER_TAG = "betterend:ladder";
const CLIMB_SPEED = 0.25;
const DESCEND_SPEED = 0.15;
const CLIMB_SOUND_INTERVAL = 20;
const GRACE_TICKS = 6;
const FALL_DAMAGE_GRACE_TICKS = 20;

const wallDirection = {
  north: "south",
  south: "north",
  east: "west",
  west: "east"
};

const oppositeOf = {
  north: "south",
  south: "north",
  east: "west",
  west: "east"
};

function isValidSupport(block) {
  if (!block) return false;
  if (block.isAir) return false;
  if (block.isLiquid) return false;
  if (block.hasTag(LADDER_TAG)) return false;
  return true;
}

function getWallBlock(block, direction) {
  switch (direction) {
    case "north": return block.north();
    case "south": return block.south();
    case "east": return block.east();
    case "west": return block.west();
    default: return undefined;
  }
}

function getNeighborBlock(block, direction) {
  switch (direction) {
    case "north": return block.north();
    case "south": return block.south();
    case "east": return block.east();
    case "west": return block.west();
    default: return undefined;
  }
}

system.beforeEvents.startup.subscribe(eventData => {
  eventData.blockComponentRegistry.registerCustomComponent('betterend:ladder_settings', {
    beforeOnPlayerPlace(e) {
      const { block, permutationToPlace } = e;
      const direction = permutationToPlace.getState('minecraft:block_face');
      const supportSide = wallDirection[direction];
      if (!supportSide) {
        e.cancel = true;
        return;
      }
      const wallBlock = getWallBlock(block, supportSide);
      if (!isValidSupport(wallBlock)) {
        e.cancel = true;
      }
    }
  });
});

world.afterEvents.playerBreakBlock.subscribe(event => {
  const { block, dimension } = event;

  for (const dir of ["north", "south", "east", "west"]) {
    const neighbor = getNeighborBlock(block, dir);
    if (!neighbor || !neighbor.hasTag(LADDER_TAG)) continue;

    const ladderDirection = neighbor.permutation.getState('minecraft:block_face');
    const requiredSupportSide = wallDirection[ladderDirection];

    if (requiredSupportSide === oppositeOf[dir]) {
      const { x, y, z } = neighbor.location;
      dimension.runCommand(`setblock ${x} ${y} ${z} air destroy`);
    }
  }
});

const playerState = new Map();

function getPlayerState(player) {
  if (!playerState.has(player.id)) {
    playerState.set(player.id, {
      soundCounter: 0,
      anchorY: undefined,
      graceTicks: 0,
      graceOriginX: undefined,
      graceOriginZ: undefined,
      lastOnLadderTick: -Infinity
    });
  }
  return playerState.get(player.id);
}

let currentTick = 0;

system.runInterval(() => {
  currentTick++;

  for (const player of world.getAllPlayers()) {
    const state = getPlayerState(player);

    if (player.isFlying) {
      continue;
    }

    const loc = player.location;
    const blockLoc = { x: Math.floor(loc.x), y: Math.floor(loc.y + 0.1), z: Math.floor(loc.z) };
    let block;
    try {
      block = player.dimension.getBlock(blockLoc);
    } catch {
      block = undefined;
    }
    const isInsideLadder = block && block.hasTag(LADDER_TAG);
    const currentVel = player.getVelocity();

    if (isInsideLadder) {
      state.lastOnLadderTick = currentTick;

      let movement = { x: 0, y: 0 };
      try {
        movement = player.inputInfo.getMovementVector();
      } catch {}

      const isTryingToMove =
        Math.abs(movement.x) > 0.01 ||
        Math.abs(movement.y) > 0.01 ||
        player.isJumping;

      if (player.isSneaking) {
        if (state.anchorY === undefined) {
          state.anchorY = loc.y;
        }
        const diff = state.anchorY - loc.y;
        const correctionVelY = Math.max(-0.1, Math.min(0.1, diff * 0.5));
        player.applyImpulse({ x: 0, y: correctionVelY - currentVel.y, z: 0 });
        state.soundCounter = 0;
        state.graceTicks = 0;
      } else {
        state.anchorY = undefined;

        if (isTryingToMove) {
          player.applyImpulse({ x: 0, y: CLIMB_SPEED - currentVel.y, z: 0 });
          if (state.soundCounter === 0) {
            block.dimension.playSound("step.ladder", block.center());
          }
          state.soundCounter = (state.soundCounter + 1) % CLIMB_SOUND_INTERVAL;
          state.graceTicks = GRACE_TICKS;
          state.graceOriginX = blockLoc.x;
          state.graceOriginZ = blockLoc.z;
        } else if (!player.isOnGround) {
          player.addEffect("slow_falling", 6, { amplifier: 0, showParticles: false });
          player.applyImpulse({ x: 0, y: -DESCEND_SPEED - currentVel.y, z: 0 });
          state.soundCounter = 0;
          state.graceTicks = 0;
        } else {
          state.soundCounter = 0;
          state.graceTicks = 0;
        }
      }
    } else {
      state.soundCounter = 0;
      state.anchorY = undefined;

      if (state.graceTicks > 0) {
        const stillNearOrigin =
          state.graceOriginX !== undefined &&
          Math.floor(loc.x) === state.graceOriginX &&
          Math.floor(loc.z) === state.graceOriginZ;

        if (stillNearOrigin) {
          player.applyImpulse({ x: 0, y: CLIMB_SPEED - currentVel.y, z: 0 });
          state.graceTicks--;
        } else {
          state.graceTicks = 0;
        }
      }
    }
  }
}, 1);

world.beforeEvents.entityHurt.subscribe(event => {
  const { hurtEntity, damageSource } = event;

  if (damageSource.cause !== EntityDamageCause.fall) return;
  if (hurtEntity.typeId !== "minecraft:player") return;

  const state = playerState.get(hurtEntity.id);
  if (!state) return;

  if (currentTick - state.lastOnLadderTick <= FALL_DAMAGE_GRACE_TICKS) {
    event.cancel = true;
  }
});

world.afterEvents.playerLeave.subscribe(event => {
  playerState.delete(event.playerId);
});