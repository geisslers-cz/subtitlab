<script module lang="ts">
  export type HueSliderProps = {
    hue: number;
  };
</script>

<script lang="ts">
  let { hue = $bindable() }: HueSliderProps = $props();
</script>
