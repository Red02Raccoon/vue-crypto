<template>
  <div>You added: {{ count }} ticker(s)</div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>
