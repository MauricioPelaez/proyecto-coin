<template>
  <div class="flex justify-center h-full py-32">
    <spinner :color="'#68d391'" :size="'100px'"></spinner>
  </div>
</template>

<script>
import Spinner from "vue-spinner/src/BounceLoader.vue";

export default {
  name: "PxSpinner",

  components: {
    Spinner,
  },
};
</script>
