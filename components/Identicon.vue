<template>
  <div class="h-12 w-12">
    <canvas
      ref="canvas"
      width="128"
      style="border-radius: 100%"
      height="128"
      class="w-full h-full"
    ></canvas>
  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  watch: {
    address(address) {
      window.jdenticon?.updateCanvas(this.$refs.canvas, address.toLowerCase())
    },
  },
  mounted() {
    window.jdenticon?.updateCanvas(
      this.$refs.canvas,
      this.address.toLowerCase()
    )
  },
}
</script>
