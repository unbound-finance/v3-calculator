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
      {{ option.name }}
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
