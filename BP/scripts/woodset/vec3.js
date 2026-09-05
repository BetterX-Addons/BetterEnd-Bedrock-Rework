export class Vector {
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }
    static add(v1, v2) {
        return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
    }
    static subtract(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
    }
    static scale(vector, scale) {
        return { x: vector.x * scale, y: vector.y * scale, z: vector.z * scale };
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static cross(v1, v2) {
        return {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
        };
    }
    static magnitude(vector) {
        return Math.hypot(vector.x, vector.y, vector.z);
    }
    static distance(v1, v2) {
        return Math.hypot(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static normalize(vector) {
        const magnitude = this.magnitude(vector);
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude,
            z: vector.z / magnitude
        };
    }
    static floor(vector) {
        return {
            x: Math.floor(vector.x),
            y: Math.floor(vector.y),
            z: Math.floor(vector.z)
        };
    }
    static ceil(vector) {
        return {
            x: Math.ceil(vector.x),
            y: Math.ceil(vector.y),
            z: Math.ceil(vector.z)
        };
    }
    static round(vector) {
        return {
            x: Math.round(vector.x),
            y: Math.round(vector.y),
            z: Math.round(vector.z)
        };
    }
    static clamp(vector, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
        return {
            x: Math.min(max, Math.max(min, vector.x)),
            y: Math.min(max, Math.max(min, vector.y)),
            z: Math.min(max, Math.max(min, vector.z))
        };
    }
    static lerp(v1, v2, step) {
        return {
            x: v1.x + (v2.x - v1.x) * step,
            y: v1.y + (v2.y - v1.y) * step,
            z: v1.z + (v2.z - v1.z) * step
        };
    }
    static slerp(v1, v2, step) {
        const cosTheta = Math.acos(this.dot(v1, v2));
        const sinTheta = Math.sin(cosTheta);
        return Vector.add(Vector.scale(v1, Math.sin((1 - step) * cosTheta) / sinTheta), Vector.scale(v2, Math.sin(step * cosTheta) / sinTheta));
    }
    static abs(vector) {
        const { x, y, z } = vector;
        return {
            x: Math.abs(x),
            y: Math.abs(y),
            z: Math.abs(z)
        };
    }
}
Vector.Up = { x: 0, y: 1, z: 0 };
Vector.Down = { x: 0, y: -1, z: 0 };
Vector.Left = { x: -1, y: 0, z: 0 };
Vector.Right = { x: 1, y: 0, z: 0 };
Vector.Forward = { x: 0, y: 0, z: 1 };
Vector.Back = { x: 0, y: 0, z: -1 };
Vector.One = { x: 1, y: 1, z: 1 };
Vector.Zero = { x: 0, y: 0, z: 0 };
Vector.West = { x: -1, y: 0, z: 0 };
Vector.East = { x: 1, y: 0, z: 0 };
Vector.North = { x: 0, y: 0, z: 1 };
Vector.South = { x: 0, y: 0, z: -1 };
