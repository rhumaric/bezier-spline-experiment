export function bisect(vector, vector2) {
  return add(normalize(vector), normalize(vector2));
}

export function add({ x, y }, { x: x2, y: y2 }) {
  return { x: x + x2, y: y + y2 };
}

export function substract({ x, y }, { x: x2, y: y2 }) {
  return { x: x - x2, y: y - y2 };
}

export function normalize(vector) {
  const n = norm(vector);
  return { x: vector.x / n, y: vector.y / n };
}

export function norm({ x, y }) {
  return Math.sqrt(x * x + y * y);
}

export function multiply(vector, factor) {
  return { x: factor * vector.x, y: factor * vector.y };
}

/**
 * Computes the Z axis coordinate of the cross product
 * of the two given vectors
 * @param {object} vector
 * @param {object} vector2
 */
export function crossZ(vector, vector2) {
  return vector.x * vector2.y - vector2.x * vector.y;
}

export function dot(vector, vector2) {
  return vector.x * vector2.x + vector.y * vector2.y;
}

export function rotate(vector, angle) {
  // Maths from https://en.wikipedia.org/wiki/Rotation_matrix
  return {
    x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  }
}

export function theta(vector) {
  if (vector.x > 0) {
    return -Math.atan(vector.y / vector.x);
  } else if (vector.x < 0) {
    return Math.PI - Math.atan(vector.y / vector.x);
  } else if (vector.x = 0) {
    return vector.y > 0 ? Math.PI / 2 : -1 * Math.PI / 2;
  }
}

export function snapAngle(vector, { snapInterval = Math.PI / 2, snapOrigin = 0 } = {}) {
  if (!snapInterval) return vector;
  const angle = theta(vector);
  const units = Math.round(angle / snapInterval);
  const snappedAngle = units * snapInterval;
  return rotate(vector, -1 * (snappedAngle - angle));
}