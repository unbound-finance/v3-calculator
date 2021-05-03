<template>
  <select
    v-model="selected"
    class="focus:outline-none cursor-pointer"
    :class="selected ? 'text-green-600 font-semibold' : ''"
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
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: this.options[0],
    }
  },
  watch: {
    selected(a) {
      this.$emit('selected', a)
    },
  },
}
</script>
