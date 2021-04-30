<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 94 94"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92"
      :stroke="color"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '96',
    },
    height: {
      type: String,
      default: '96',
    },
    color: {
      type: String,
      default: '#059669',
    },
  },
}
</script>
