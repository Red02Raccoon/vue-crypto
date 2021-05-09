<template>
  <div class="w-full">
    <div class="shadow w-full bg-gray-100 mt-2">
      <div
        class="min-w-max text-xs leading-none text-center text-white py-1 px-1"
        :class="stateClasses"
        :style="{ width: `${width}%` }"
      >
        {{ width }} %
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    max: Number,
    value: Number,
  },

  computed: {
    width() {
      return Math.floor((this.value * 100) / this.max);
    },
    stateClasses() {
      return {
        "bg-pink-700": this.width < 30,
        "bg-yellow-400": this.width >= 30 && this.width < 80,
        "bg-green-500": this.width >= 80,
      };
    },
  },
};
</script>
