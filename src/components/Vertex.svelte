<script>
  import { pannable } from "../actions/pannable.js";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let coordinates;
  export let label;

  let x, y;
  $: x = coordinates.x;
  $: y = coordinates.y;
  $: console.log(label);

  let grabbing = false;

  function handlePanMove(event) {
    grabbing = true;
    x = x + event.detail.dx;
    y = y + event.detail.dy;
    dispatch("change", { x, y });
  }

  function handlePanEnd() {
    grabbing = false;
  }

  const KEYCODE_LEFT = 37;
  const KEYCODE_UP = 38;
  const KEYCODE_RIGHT = 39;
  const KEYCODE_DOWN = 40;

  const OFFSET = 1;
  const SHIFT_FACTOR = 10;

  function handleKeyup(event) {
    console.log(event, event.keyCode);
    switch (event.keyCode) {
      case KEYCODE_LEFT: {
        x = x - OFFSET * (event.shiftKey ? SHIFT_FACTOR : 1);
        dispatch("change", { x, y });
        break;
      }
      case KEYCODE_RIGHT: {
        x = x + OFFSET * (event.shiftKey ? SHIFT_FACTOR : 1);
        dispatch("change", { x, y });
        break;
      }
      case KEYCODE_DOWN: {
        y = y + OFFSET * (event.shiftKey ? SHIFT_FACTOR : 1);
        dispatch("change", { x, y });
        break;
      }
      case KEYCODE_UP: {
        y = y - OFFSET * (event.shiftKey ? SHIFT_FACTOR : 1);
        dispatch("change", { x, y });
        break;
      }
    }
    console.log("Keypress");
  }
</script>

<style>
  circle {
    cursor: grab;
    fill: hsl(35, 66%, 80%);
  }

  .handle {
    fill-opacity: 0.01;
    fill: hsl(215, 66%, 98%);
    stroke-width: 2;
  }

  g:hover .handle {
    fill-opacity: 0.5;
    stroke: hsl(215, 66%, 98%);
  }

  g:focus .handle {
    stroke: hsl(215, 66%, 98%);
    stroke-width: 4;
  }

  .grabbing {
    cursor: grabbing;
  }
</style>

<g
  class:grabbing
  use:pannable
  on:panmove={handlePanMove}
  on:panend={handlePanEnd}
  on:keyup={handleKeyup}
  aria-label={label}
  tabindex="0">
  <circle class="handle" cx={x} cy={y} r="20" />
  <circle cx={x} cy={y} r="8" />
</g>
