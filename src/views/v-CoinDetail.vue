<template>
  <div class="flex-col">
    <px-spinner v-if="isLoading" />
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ dollarFilter(asset.priceUsd) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ dollarFilter(min) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ dollarFilter(max) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ dollarFilter(avg) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ percentFilter(asset.changePercent24Hr) }}</span>
            </li>
          </ul>
        </div>
        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded outline-none"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="ConvertValue"
                id="convertValue"
                type="number"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl text-green-600 font-semibold"
            >{{ convertResult }} {{ fromUsd ? asset.symbol : "USD" }}</span
          >
        </div>
      </div>

      <line-chart
        class="my-10"
        :colors="['#68d391']"
        :min="min"
        :max="max"
        :data="chartData"
      />

      <h3 class="text-xl my-10 font-semibold text-green-600">
        Mejores Ofertas de Cambio
      </h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ dollarFilter(m.priceUsd) }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button v-if="!m.url" @click="getWebsite(m)">
              <px-spinner-button v-if="m.isLoading || false" class="mx-8" />
              <slot v-if="!m.isLoading">Obtener URL</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">
              {{ m.url || "No hay puto" }}</a
            >
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from "@/api";
import { dollarFilter, percentFilter } from "@/filter";
import PxButton from "@/components/PxButton.vue";
import PxSpinner from "@/components/PxSpinner";
import PxSpinnerButton from "@/components/PxSpinnerButton";

export default {
  name: "CoinDetail",

  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      ConvertValue: null,
    };
  },

  computed: {
    convertResult() {
      if (!this.ConvertValue) {
        return 0;
      }

      const result = this.fromUsd
        ? this.ConvertValue / this.asset.priceUsd
        : this.ConvertValue * this.asset.priceUsd;

      return result.toFixed(4);
    },

    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      );
    },

    chartData() {
      const data = [];
      this.history.map((h) => {
        data.push([h.date, parseFloat(h.priceUsd).toFixed(2)]);
      });
      return data;
    },
  },

  components: {
    PxButton,
    PxSpinner,
    PxSpinnerButton,
  },

  watch: {
    $route() {
      this.getCoin();
    },
  },

  created() {
    this.getCoin();
  },

  methods: {
    getCoin() {
      const id = this.$route.params.id;
      this.isLoading = true;
      setTimeout(() => {
        Promise.all([
          api.getAsset(id),
          api.getAssetHistory(id),
          api.getMarkets(id),
        ])
          .then(([asset, history, markets]) => {
            this.asset = asset;
            this.history = history;
            this.markets = markets;
          })
          .finally(() => (this.isLoading = false));
      }, 1000);
    },

    getWebsite(exchange) {
      exchange.isLoading = true;
      setTimeout(() => {
        return api
          .getExchange(exchange.exchangeId)
          .then((res) => {
            if (res && res.exchangeUrl) {
              exchange.url = res.exchangeUrl;
            } else {
              console.error(
                "exchangeUrl no está presente en la respuesta",
                res
              );
              exchange.url = "URL no disponible";
            }
          })
          .finally(() => {
            exchange.isLoading = false;
          });
      }, 500);
    },

    toggleConverter() {
      this.fromUsd = !this.fromUsd;
    },
  },

  setup() {
    return {
      dollarFilter,
      percentFilter,
    };
  },
};
</script>

<style scoped>
td {
  height: 65px;
  padding: 10px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 10px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
