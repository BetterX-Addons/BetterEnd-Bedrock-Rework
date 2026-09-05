import { system } from "@minecraft/server";

const ENERGY_RETENTION = 0.85;
const BOUNCE_CHAIN_TIMEOUT = 200; // ticks (~10s) sin rebotar antes de tratarlo como caída nueva

const lastBounce = new Map(); // entity.id -> { height, tick }

function impulseFromHeight(distance) {
    return distance > 15
        ? 0.15 + (distance - 1) * 0.1
        : 0.55 + (distance - 1) * 0.1;
}

export const slimeBlockComponent = {
    onEntityFallOn(e) {
        const { entity, fallDistance } = e;

        if (!entity) return;
        if (fallDistance < 0.5) return;
        if (entity.typeId === 'minecraft:player' && entity.isSneaking) return;

        const now = system.currentTick;
        const previous = lastBounce.get(entity.id);
        const stillBouncing = previous && (now - previous.tick) <= BOUNCE_CHAIN_TIMEOUT;

        // Primer rebote de la cadena: usa la caída real.
        // Rebotes siguientes (mismo bounce-loop, sin pausa larga): decae desde
        // el rebote anterior en vez de la caída real, para que pierda altura.
        const referenceHeight = stillBouncing
            ? previous.height * ENERGY_RETENTION
            : Math.min(fallDistance, 35);

        const impulse = impulseFromHeight(referenceHeight);

        if (impulse < 0.05) {
            lastBounce.delete(entity.id);
            return;
        }

        lastBounce.set(entity.id, { height: referenceHeight, tick: now });
        entity.applyImpulse({ x: 0, y: impulse, z: 0 });
    }
};
