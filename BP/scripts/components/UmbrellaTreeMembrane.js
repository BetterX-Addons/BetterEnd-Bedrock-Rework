export const umbrellaTreeMembraneComponent = {
    onEntityFallOn({ entity, fallDistance, block, dimension }) {
        if (fallDistance < 0.5) return; // Detener micro-rebotes

        let impulse = 0.55;

        let myFallDistance = Math.min(fallDistance, 35);

        if (myFallDistance > 15) {
            impulse = 0.15;
        }

        if (entity.isSneaking) {
            impulse *= 0.25;
        }

        let currentImpulse = impulse + (myFallDistance - 1) * 0.1;
        currentImpulse *= 0.95;

        if (currentImpulse > 0) {
            entity.applyImpulse({ x: 0, y: currentImpulse, z: 0 });
        }

        dimension.playSound("mob.slime.big", block.location, { pitch: 1.0, volume: 1.0 });
    }
};