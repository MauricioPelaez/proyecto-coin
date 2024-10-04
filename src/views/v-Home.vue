<template>
  <div>
    <px-spinner v-if="isLoading" />
    <px-assets-table v-if="!isLoading" :assets="assets" />
  </div>
</template>

<script>
import api from "@/api";
import PxAssetsTable from "@/components/PxAssetsTable";
import PxSpinner from "@/components/PxSpinner";

export default {
  name: "v-Home",

  components: {
    PxAssetsTable,
    PxSpinner,
  },

  data() {
    return {
      isLoading: false,
      assets: [],
    };
  },

  created() {
    this.isLoading = true;
    setTimeout(() => {
      api
        .getAssets()
        .then((assets) => (this.assets = assets))
        .finally(() => (this.isLoading = false));
    }, 1000);
  },
};
</script>
