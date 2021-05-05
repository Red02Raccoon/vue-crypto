<template>
  <button
    class="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    :class="{
      'opacity-50 cursor-not-allowed': disabled,
    }"
    :disabled="disabled"
  >
    <slot>Ooops! You didn't add text. It is fallback</slot>
  </button>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    title: String,
  },
};
</script>
