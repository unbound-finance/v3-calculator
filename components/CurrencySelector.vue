<template>
  <select
    v-model="selected"
    class="border-b-2 border-dotted focus:outline-none cursor-pointer"
    :class="selected ? 'text-green-600 border-green-500 font-semibold' : ''"
  >
    <option
      v-for="(option, index) in options"
      :key="index"
      class="text-sm"
      :value="option"
    >
      {{ option }}
    </option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      selected: 'ETH',
      options: ['ETH', 'DAI', 'ETH-DAI'],
    }
  },
  watch: {
    selected(a) {
      this.$emit('selected', a)
    },
  },
}
</script>
