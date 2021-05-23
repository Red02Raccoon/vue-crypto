<template>
  <div class="container flex flex-col max-w-3xl mx-auto">
    <div class="progress-bar">
      <div>Form completed:</div>
      <progress-bar
        :max="progressBarMaxValue"
        :value="progressBarCurrentValue"
      />
    </div>

    <div class="form mt-5">
      <input-item
        class="mb-2"
        v-for="item in formFields"
        :key="item.field"
        :hasError="!item.isValid && typeof item.isValid === 'boolean'"
        :field="item.field"
        :label="item.label"
        :errorMessage="item.errorMessage"
        :value="item.value"
        @input="handleInputChange(item, $event)"
      />

      <button
        type="button"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-3"
        :class="{ 'opacity-40': !canSend }"
        :disabled="!canSend"
      >
        Send
      </button>
    </div>
  </div>
</template>
<script>
import ProgressBar from "@/components/ProgressBar.vue";
import InputItem from "@/components/Input.vue";
export default {
  components: { ProgressBar, InputItem },
  data() {
    return {
      formFields: [
        {
          field: "first_name",
          label: "First name",
          value: "",
          isValid: null,
          errorMessage: "This field should contain at least 5 symbols",
          validation() {
            this.isValid = this.value.length >= 5;
          },
        },
        {
          field: "last_name",
          label: "Last name",
          value: "",
          isValid: null,
          errorMessage: "This field should contain at leastn 6 symbols",
          validation() {
            this.isValid = this.value.length >= 6;
          },
        },
        {
          field: "city",
          label: "Your city",
          value: "",
          isValid: null,
          errorMessage: "This field should contain at leastn 3 symbols",
          validation() {
            this.isValid = this.value.length >= 3;
          },
        },
      ],
      value: 2,
    };
  },

  computed: {
    canSend() {
      return this.formFields.every(({ isValid, value }) => isValid && value);
    },
    progressBarMaxValue() {
      return this.formFields.length;
    },
    progressBarCurrentValue() {
      return this.formFields.filter(({ isValid }) => isValid).length;
    },
  },

  methods: {
    handleInputChange(item, { e }) {
      item.value = e.target.value;

      item.validation?.();
    },
  },
};
</script>
