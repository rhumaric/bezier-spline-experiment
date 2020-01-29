import { add, subtract, bisect, crossZ, multiply, dot, rotate, snapAngle, normalize } from './vectors';

/**
 * Turns an Array of `{x,y}` coordinates into a structure
 * for rendering a bezier spline going through each of them
 * @param {*} coordinatesList
 */
export default function toBezier(coordinatesList) {
  return coordinatesList
    .map(clone)
    .map(vectors)
    .map(bisectingVector)
    .map(tangents)
    .map(snapTangents)
    .map(controlPoints)
}

/**
 * Clone the properties we're interested in so we're safe
 * to mutate things without altering the original object
 * @param {*} param0
 */
function clone({ x, y }) {
  return { x, y };
}

/**
 * With `b` being the current point, build the coordinates
 * of `ba` (vector to the previous point) and `bc` (to the next point)
 * as well as `ac` (gives a sense of the direction the curve will go,
 * which will be handy for computing the tangents)
 * @param {*} coordinates
 * @param {*} index
 * @param {*} coordinatesList
 */
function vectors(coordinates, index, coordinatesList) {
  if (index) {
    // All points except the first have a segment leading to them
    coordinates.ba = subtract(coordinatesList[index - 1], coordinatesList[index]);
  }
  if (index < (coordinatesList.length - 1)) {
    // All points except the last have one going from them
    coordinates.bc = subtract(coordinatesList[index + 1], coordinatesList[index]);
  }
  if (index && index < (coordinatesList.length - 1)) {
    // And the ones in between also have a segment going from the previous to the next
    coordinates.ac = subtract(coordinatesList[index + 1], coordinatesList[index - 1]);
  }
  return coordinates;
}

function bisectingVector(coordinates) {
  if (coordinates.ba && coordinates.bc) {
    // Normalizing is important here, it'll allow easy scaling
    // and projections later on
    coordinates.bisectingVector = normalize(bisect(coordinates.ba, coordinates.bc));
  }
  return coordinates;
}

function tangents(coordinates, index, coordinatesList) {
  if (coordinates.ac) {
    // This will be all the intermediate points
    // First we need to get the tangent by rotating the bisectingVector
    const angle = tangentRotationAngle(coordinates);
    const tangent = rotate(coordinates.bisectingVector, angle);

    // Now we have the direction we need the amplitude
    // for that we can project ba and bc onto the vector
    coordinates.tangentBa = multiply(tangent, dot(coordinates.ba, tangent) * 0.5);
    coordinates.tangentBc = multiply(tangent, dot(coordinates.bc, tangent) * 0.5);
  } else if (coordinates.ba) {
    // That will be the last point of the series
    // we project it to the previous bisectingVector
    const bisectingVector = coordinatesList[index - 1].bisectingVector;
    coordinates.tangentBa = multiply(bisectingVector, dot(coordinates.ba, bisectingVector) * 0.5);
  } else {
    // That will be the first point, just like the last
    // we projecton the adjacent bisectingVector
    const bisectingVector = coordinatesList[index + 1].bisectingVector;
    coordinates.tangentBc = multiply(bisectingVector, dot(coordinates.bc, bisectingVector) * 0.5);
  }

  return coordinates;
}

function tangentRotationAngle({ ac, bisectingVector }) {
  // Computing the z value of the cross product between
  // ac and the bisecting vector. It's sign represents
  // in which direction to rotate for getting the tangent
  const z = crossZ(ac, bisectingVector);
  return z > 0 ? Math.PI / 2 : - Math.PI / 2;
}

function snapTangents(coordinates) {
  if (coordinates.tangentBa) {
    coordinates.snappedTangentBa = snapAngle(coordinates.tangentBa);
  }
  if (coordinates.tangentBc) {
    coordinates.snappedTangentBc = snapAngle(coordinates.tangentBc);
  }
  return coordinates;
}

function controlPoints(coordinates) {
  if (coordinates.snappedTangentBa || coordinates.tangentBa) {
    coordinates.controlPointBa = add(
      coordinates.snappedTangentBa || coordinates.tangentBa,
      coordinates
    );
  }
  if (coordinates.snappedTangentBc || coordinates.tangentBc) {
    coordinates.controlPointBc = add(
      coordinates.snappedTangentBc || coordinates.tangentBc,
      coordinates
    );
  }
  return coordinates;
}

