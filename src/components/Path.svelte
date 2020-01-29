<script context="module">
  import {
    add,
    subtract,
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
    for (let i = 0; i < coordinates.length; i++) {
      const { ba, bc, bisectingVector, x, y } = coordinates[i];
      if (bisectingVector) {
        const normAverage = (norm(ba) + norm(bc)) / 3;
        const bisecting = multiply(bisectingVector, normAverage);
        commands.push("M");
        commands.push(`${x},${y}`);
        // lowercase to use coordinates as relative from the last point
        commands.push("l");
        commands.push(`${bisecting.x},${bisecting.y}`);
      }
    }
    return commands.join(" ");
  }

  export function bezierTangents(coordinates) {
    const commands = [];
    for (let i = 0; i < coordinates.length; i++) {
      const { tangentBa, tangentBc, x, y } = coordinates[i];
      if (tangentBa) {
        commands.push("M");
        commands.push(`${x},${y}`);
        // lowercase to use coordinates as relative from the last point
        commands.push("l");
        commands.push(`${tangentBa.x},${tangentBa.y}`);
      }

      if (tangentBc) {
        commands.push("M");
        commands.push(`${x},${y}`);
        commands.push("l");
        commands.push(`${tangentBc.x},${tangentBc.y}`);
      }
    }
    return commands.join(" ");
  }

  export function snappedTangents(coordinates) {
    const commands = [];
    for (let i = 0; i < coordinates.length; i++) {
      const { snappedTangentBa, snappedTangentBc, x, y } = coordinates[i];
      if (snappedTangentBa) {
        commands.push("M");
        commands.push(`${x},${y}`);
        // lowercase to use coordinates as relative from the last point
        commands.push("l");
        commands.push(`${snappedTangentBa.x},${snappedTangentBa.y}`);
      }

      if (snappedTangentBc) {
        commands.push("M");
        commands.push(`${x},${y}`);
        commands.push("l");
        commands.push(`${snappedTangentBc.x},${snappedTangentBc.y}`);
      }
    }
    return commands.join(" ");
  }

  export function bezierCurve(coordinates) {
    const commands = [];
    commands.push("M");
    commands.push(`${coordinates[0].x},${coordinates[0].y}`);
    // TODO: Filter coordinates to remove duplicates
    for (let i = 0; i < coordinates.length; i++) {
      const { controlPointBa, controlPointBc, tangentBc } = coordinates[i];
      if (controlPointBa) {
        commands.push(`${controlPointBa.x},${controlPointBa.y}`);
        commands.push(`${coordinates[i].x},${coordinates[i].y}`);
      }
      if (controlPointBc) {
        commands.push("C");
        commands.push(`${controlPointBc.x},${controlPointBc.y}`);
      }
    }
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
