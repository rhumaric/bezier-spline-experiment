<script>
  import Vertex from "./Vertex.svelte";
  import {
    straightLines,
    bisectingVector,
    tangents,
    bezierCurves,
    snappedTangents
  } from "../lib/toD";
  import toBezier from "../lib/toBezier";

  let width = window.innerWidth,
    height = window.innerHeight;
  let coordinates = [];
  $: coordinates = [
    { x: (20 / 100) * width, y: (20 / 100) * height },
    { x: (60 / 100) * width, y: (40 / 100) * height },
    { x: (40 / 100) * width, y: (60 / 100) * height },
    { x: (80 / 100) * width, y: (80 / 100) * height },
    { x: (90 / 100) * width, y: (80 / 100) * height }
  ];
  $: bezierData = toBezier(coordinates);

  function handleChange(i) {
    return function(event) {
      coordinates = update(coordinates, i, event.detail);
    };
  }

  function update(coordinates, i, value) {
    const result = [...coordinates];
    result[i] = value;
    return result;
  }
</script>

<style>
  main {
    position: relative;
    width: 100%;
    height: 100%;
  }

  svg {
    background: hsl(202, 95%, 10%);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }

  path {
    stroke: white;
    stroke-width: 2;
    fill: none;
  }

  path:not(.curve) {
    opacity: 0.65;
  }
</style>

<main>
  {#if width && height}
    <svg {width} {height} viewBox="0 0 {width} {height}">
      <path
        d={straightLines(bezierData)}
        stroke-dasharray="8 4"
        fill="none"
        stroke="black"
        stroke-width="2" />
      <path
        d={bisectingVector(bezierData)}
        stroke-dasharray={'8 4 2 4'}
        fill="none"
        stroke="black"
        stroke-width="2" />
      <path
        d={tangents(bezierData)}
        stroke-dasharray={'16 4 2 4'}
        fill="none"
        stroke="black"
        stroke-width="2" />
      <path
        d={snappedTangents(bezierData)}
        stroke-dasharray={'24 4 2 4'}
        fill="none"
        stroke="black"
        stroke-width="2" />
      <path
        class="curve"
        d={bezierCurves(bezierData)}
        fill="none"
        stroke="black"
        stroke-width="2" />
      {#each coordinates as coordinate, i (i)}
        <Vertex
          coordinates={coordinate}
          on:change={handleChange(i)}
          label={`Point ${i}`} />
      {/each}

    </svg>
  {/if}
</main>
