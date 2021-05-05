<template>
  <div class="filter flex">
    <b>Filter:</b>

    <input
      class="mx-3"
      :value="value"
      @input="$emit('input-change', $event.target.value)"
    />

    <button v-if="value" @click="$emit('input-change', '')">
      <delete-icon />
    </button>
  </div>
</template>

<script>
import DeleteIcon from "./Icons/DeleteIcon.vue";
export default {
  components: {
    DeleteIcon,
  },

  props: {
    value: {
      type: String,
      required: true,
    },
  },

  emits: {
    "input-change": null,
  },
};
</script>
