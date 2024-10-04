<template>
  <div class="flex justify-center">
    <spinner :color="'#68d391'" :size="'6px'"></spinner>
  </div>
</template>

<script>
import Spinner from "vue-spinner/src/BeatLoader.vue";

export default {
  name: "PxSpinnerButton",

  components: {
    Spinner,
  },
};
</script>
