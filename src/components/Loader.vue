<template>
  <div
    v-if="isLoading"
    class="fixed w-100 h-100 opacity-90 bg-purple-800 inset-0 z-50 flex items-center justify-center"
  >
    <loader-icon class="-ml-1 mr-3" />
  </div>
</template>

<script>
import LoaderIcon from "./Icons/LoaderIcon";

export default {
  props: {
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { LoaderIcon },
};
</script>
