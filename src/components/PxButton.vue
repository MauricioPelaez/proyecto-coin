<template>
  <button
    @click="buttonClick"
    class="bg-transparent hover:bg-green-500 text-green-600 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded outline-none"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "PxButton",

  methods: {
    buttonClick() {
      this.$emit("click");
    },
  },
};
</script>
