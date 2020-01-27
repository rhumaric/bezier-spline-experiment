<script context="module">
  import {
    add,
    substract,
    bisect,
    multiply,
    normalize,
    norm,
    theta,
    crossZ,
    rotate,
    dot,
    snapAngle
  } from "../lib/vectors";

  function straightLines(coordinates) {
    if (coordinates) {
      // First we'll need to
      const commands = ["M", `${coordinates[0].x},${coordinates[0].y}`, "L"];
      for (let i = 1; i < coordinates.length; i++) {
        commands.push(`${coordinates[i].x},${coordinates[i].y}`);
      }
      return commands.join(" ");
    }
  }

  export function bisectingVector(coordinates) {
    const commands = [];
    for (let i = 1; i < coordinates.length - 1; i++) {
      const a = substract(coordinates[i - 1], coordinates[i]);
      const b = substract(coordinates[i + 1], coordinates[i]);
      const normAverage = (norm(a) + norm(b)) / 3;
      const bisecting = multiply(bisect(a, b), normAverage);
      commands.push("M");
      commands.push(`${coordinates[i].x},${coordinates[i].y}`);
      // lowercase to use coordinates as relative from the last point
      commands.push("l");
      commands.push(`${bisecting.x},${bisecting.y}`);
    }
    return commands.join(" ");
  }

  export function bezierTangents(coordinates) {
    const commands = [];
    for (let i = 1; i < coordinates.length - 1; i++) {
      const ba = substract(coordinates[i - 1], coordinates[i]);
      const bc = substract(coordinates[i + 1], coordinates[i]);
      const ac = substract(coordinates[i + 1], coordinates[i - 1]);
      const bisectingVector = normalize(bisect(ba, bc));
      // Computing the z value of the cross product between
      // ac and the bisecting vector. It's sign represents
      // in which direction to rotate for getting the tangent
      const z = crossZ(ac, bisectingVector);
      let tangent;
      if (z > 0) {
        tangent = rotate(bisectingVector, Math.PI / 2);
      } else if (z < 0) {
        tangent = rotate(bisectingVector, -Math.PI / 2);
      } else {
        // This means AC and the bisecting vector are parallel,
        // so the angle between ba and bc is null, picking +90deg arbitrarily
        // TODO: Maybe account for earlier points?
        tangent = rotate(bisectingVector, Math.PI / 2);
      }

      // Now we have the direction we need the amplitude
      // for that we can project ba and bc onto the vector
      const tangentba = multiply(tangent, dot(ba, tangent) * 0.5);
      const tangentbc = multiply(tangent, dot(bc, tangent) * 0.5);

      commands.push("M");
      commands.push(`${coordinates[i].x},${coordinates[i].y}`);
      // lowercase to use coordinates as relative from the last point
      commands.push("l");
      commands.push(`${tangentba.x},${tangentba.y}`);

      commands.push("M");
      commands.push(`${coordinates[i].x},${coordinates[i].y}`);
      commands.push("l");
      commands.push(`${tangentbc.x},${tangentbc.y}`);
    }
    return commands.join(" ");
  }

  export function bezierCurve(coordinates) {
    const commands = [];
    // Push the start of the curve
    // Move to the first point
    commands.push("M");
    commands.push(`${coordinates[0].x},${coordinates[0].y}`);
    // And initiate a bezier curve
    commands.push(`C${coordinates[0].x},${coordinates[0].y}`);
    // TODO: Filter coordinates to remove duplicates
    for (let i = 1; i < coordinates.length - 1; i++) {
      const ba = substract(coordinates[i - 1], coordinates[i]);
      const bc = substract(coordinates[i + 1], coordinates[i]);
      const ac = substract(coordinates[i + 1], coordinates[i - 1]);
      const bisectingVector = normalize(bisect(ba, bc));
      // Let's snap it to the nearest 90deg

      // Computing the z value of the cross product between
      // ac and the bisecting vector. It's sign represents
      // in which direction to rotate for getting the tangent
      const z = crossZ(ac, bisectingVector);
      let tangent;
      if (z > 0) {
        tangent = rotate(bisectingVector, Math.PI / 2);
      } else if (z < 0) {
        tangent = rotate(bisectingVector, -Math.PI / 2);
      } else {
        // This means AC and the bisecting vector are parallel,
        // so the angle between ba and bc is null, picking +90deg arbitrarily
        // TODO: Maybe account for earlier points?
        tangent = rotate(bisectingVector, Math.PI / 2);
      }

      // Now we have the direction we need the amplitude
      // for that we can project ba and bc onto the vector
      const tangentba = snapAngle(multiply(tangent, dot(ba, tangent) * 0.5));
      const tangentbc = snapAngle(multiply(tangent, dot(bc, tangent) * 0.5));
      const controlPointBa = add(tangentba, coordinates[i]);
      const controlPointBc = add(tangentbc, coordinates[i]);
      commands.push(`${controlPointBa.x},${controlPointBa.y}`);
      commands.push(`${coordinates[i].x},${coordinates[i].y}`);

      commands.push("C");
      commands.push(`${controlPointBc.x},${controlPointBc.y}`);
    }

    // End the path
    commands.push(
      `${coordinates[coordinates.length - 1].x},${coordinates[coordinates.length - 1].y}`
    );
    commands.push(
      `${coordinates[coordinates.length - 1].x},${coordinates[coordinates.length - 1].y}`
    );

    return commands.join(" ");
  }
</script>

<script>
  // The coordinates for the path to go through
  export let coordinates;
  // The function transforming the path in the `d` parameter
  export let d = straightLines;

  export let opacity = 0.65;

  export let strokeDasharray = null;
</script>

<path
  d={d(coordinates)}
  {opacity}
  stroke-dasharray={strokeDasharray}
  stroke="white"
  fill="none"
  stroke-width="2" />
