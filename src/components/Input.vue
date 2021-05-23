<template>
  <div class="input-item">
    <div class="flex">
      <label
        class="block text-sm font-medium text-gray-700"
        :class="{
          'text-red-700': hasError,
        }"
        :for="field"
        >{{ label }}</label
      >
      <span class="text-red-500 text-sm ml-5" v-show="hasError">{{
        errorMessage
      }}</span>
    </div>
    <input
      type="text"
      class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md mt-1"
      :name="field"
      :id="field"
      :value="value"
      @input="$emit('input', { e: $event, test_field: 123 })"
    />
  </div>
</template>
<script>
export default {
  props: ["hasError", "field", "label", "errorMessage", "value"],
  emits: {
    input: null,
  },
};
</script>
