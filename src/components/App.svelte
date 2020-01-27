<script>
  import Vertex from "./Vertex.svelte";
  import Path, {
    bisectingVector,
    bezierTangents,
    bezierCurve
  } from "./Path.svelte";

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
</style>

<main>
  {#if width && height}
    <svg {width} {height} viewBox="0 0 {width} {height}">
      <Path {coordinates} strokeDasharray="8 4" />
      <Path {coordinates} d={bisectingVector} strokeDasharray={'8 4 2 4'} />
      <Path {coordinates} d={bezierTangents} strokeDasharray={'16 4 2 4'} />
      <Path {coordinates} d={bezierCurve} opacity="1" />
      {#each coordinates as coordinate, i (i)}
        <Vertex
          coordinates={coordinate}
          on:change={handleChange(i)}
          label={`Point ${i}`} />
      {/each}

    </svg>
  {/if}
</main>
