<template>
  <div class="container flex flex-col items-center bg-gray-100 mx-auto p-4">
    <loader :isLoading="isLoading" />

    <div class="container">
      <section>
        <div class="settings">
          <div class="filter">
            <div><b>Filter:</b> <input class="mx-3" v-model="filter" /></div>
          </div>
          <hr class="w-full border-t border-gray-600 my-4" />
        </div>

        <div class="add-ticker">
          <div class="max-w-xs">
            <label
              for="wallet"
              class="block text-sm font-medium text-gray-700 font-semibold"
              >Ticker {{ ticker }}</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                v-on:keydown.enter="addTicker"
                v-on:keyup="handleKeyUp"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>

            <div
              v-if="currentSuggestions.length"
              class="suggestions flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                v-for="item in currentSuggestions"
                :key="item"
                v-on:click="handleAddSuggestion(item)"
              >
                {{ item }}
              </span>
            </div>

            <div v-if="error" class="text-sm text-red-600">
              Such ticker has already been added
            </div>
          </div>

          <add-ticker-button
            class="my-4"
            :disabled="isAddDisabled"
            @click="addTicker"
          />
        </div>

        <total-tickers-count :count="tickers.length" />
      </section>

      <div class="tickers" v-if="paginatedTickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="{ id, name, price } in paginatedTickers"
            :key="id"
            @click="selectTicker(name)"
            :class="{
              'border-4': selectedTicker === name,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="deleteTicker(name)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <delete-icon />
              Delete
            </button>
          </div>
        </dl>
      </div>

      <div class="pagination" v-if="paginatedTickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div class="flex items-center justify-center">
          <div class="flex items-center">
            <navigation-button
              class="my-4"
              :disabled="!hasPrevPage"
              :title="Prev"
              @click="page = page - 1"
              >Prev</navigation-button
            >

            <div class="mx-4">
              <b>{{ page }}</b>
            </div>

            <navigation-button
              class="my-4"
              :disabled="!hasNextPage"
              @click="page = page + 1"
              >Next</navigation-button
            >
          </div>
        </div>
      </div>

      <hr class="w-full border-t border-gray-600 my-4" />

      <section class="relative selected-ticker" v-if="selectedTicker">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker }}
        </h3>
        <div
          class="flex items-end border-gray-600 border-b border-l h-64"
          ref="graph"
        >
          <div
            v-for="(g, i) in normalizedGraph"
            :key="i"
            :style="{ height: `${g}%`, width: `${graphColunmWidth}px` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click="deleteSelectedTicker"
          type="button"
          class="absolute top-0 right-0"
        >
          <close-icon />
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import {
  subscribeToTicker,
  unsubscribeFromTicker,
  getAllCoins,
} from "./app.js";

import DeleteIcon from "./components/Icons/DeleteIcon.vue";
import CloseIcon from "./components/Icons/CloseIcon.vue";
import Loader from "./components/Loader.vue";
import TotalTickersCount from "./components/TotalTickersCount.vue";
import AddTickerButton from "./components/AddTickerButton.vue";
import NavigationButton from "./components/NavigationButton.vue";

const tickersKey = "tickers-list";
const pageSize = 6;

export default {
  name: "App",

  components: {
    DeleteIcon,
    CloseIcon,
    Loader,
    TotalTickersCount,
    AddTickerButton,
    NavigationButton,
  },

  data() {
    return {
      isLoading: false,
      selectedTicker: null,
      ticker: "",
      graph: [],
      tickers: [],
      filter: "",
      page: 1,
      maxGraphElements: 1,
      graphColunmWidth: 38,
      error: false,
      suggestions: [],
      currentSuggestions: [],
      isAddDisabled: true,
    };
  },

  async created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) {
      this.filter = windowData.filter;
    }

    if (windowData.page) {
      this.page = +windowData.page;
    }

    this.tickers = JSON.parse(localStorage.getItem(tickersKey) || "[]");

    this.tickers.forEach((ticker) =>
      subscribeToTicker(ticker.name, (price) => {
        this.updateTicker(ticker.name, price);
      })
    );

    this.suggestions = await getAllCoins();
  },

  mounted() {
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },

  methods: {
    addTicker() {
      if (!this.ticker) {
        return;
      }

      if (!this.isValidTicker(this.ticker)) {
        return;
      }

      const newTicker = {
        name: this.ticker,
        price: 0,
        id: this.tickers.length + 1,
      };

      this.tickers = [...this.tickers, newTicker];

      subscribeToTicker(newTicker.name, (price) => {
        this.updateTicker(newTicker.name, price);
      });

      this.filter = "";
      this.ticker = "";
      this.currentSuggestions = [];
    },

    handleKeyUp(e) {
      if (e.key !== "Enter" && this.error) {
        this.error = false;
      }
    },

    deleteTicker(name) {
      if (name === this.selectedTicker) {
        this.selectedTicker = null;
      }

      this.tickers = this.tickers.filter((item) => item.name !== name);
      unsubscribeFromTicker(name);

      this.error = false;
    },

    deleteSelectedTicker() {
      this.selectedTicker = null;
    },

    selectTicker(name) {
      this.selectedTicker = name;
    },

    formatPrice(price) {
      if (typeof price !== "number") {
        return price;
      }

      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    isValidTicker(ticker) {
      const value = ticker.trim();
      const hasTicker = this.tickers.find(
        ({ name }) => name.toLowerCase() === value.toLowerCase()
      );

      this.error = hasTicker;

      return !hasTicker;
    },

    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t.name === this.selectedTicker) {
            this.graph.push(price);

            if (this.graph.length > this.maxGraphElements) {
              this.graph = this.graph.slice(-this.maxGraphElements);
            }
          }

          t.price = price;
        });
    },

    calculateMaxGraphElements() {
      const { graph: graphRef } = this.$refs;

      if (!graphRef) {
        return;
      }

      this.maxGraphElements = Math.floor(
        graphRef.clientWidth / this.graphColunmWidth
      );
    },

    handleAddSuggestion(item) {
      this.ticker = item;

      this.addTicker();
    },
  },

  computed: {
    normalizedGraph() {
      const max = Math.max(...this.graph);
      const min = Math.min(...this.graph);

      if (max === min) {
        return this.graph.map(() => 50);
      }

      const formattedData = this.graph.map(
        (price) => 5 + ((price - min) * 95) / (max - min)
      );

      return formattedData;
    },

    startIndex() {
      return (this.page - 1) * pageSize;
    },

    endIndex() {
      return this.page * pageSize;
    },

    filteredTickers() {
      return this.tickers.filter(({ name }) => name.includes(this.filter));
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    hasPrevPage() {
      return this.page !== 1;
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    pageFilterState() {
      return {
        page: this.page,
        filter: this.filter,
      };
    },
  },

  watch: {
    ticker() {
      const currentTicker = this.ticker.trim();
      this.isAddDisabled = !currentTicker;

      if (currentTicker) {
        this.currentSuggestions = this.suggestions
          .filter((item) => item.includes(currentTicker))
          .slice(-4)
          .sort();
      }
    },

    tickers() {
      localStorage.setItem(tickersKey, JSON.stringify(this.tickers));
    },

    selectedTicker() {
      this.graph = [];

      //   setTimeout(this.calculateMaxGraphElements, 100);
      this.$nextTick().then(this.calculateMaxGraphElements);
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    pageFilterState({ filter, page }) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.origin}/?filter=${filter}&page=${page}`
      );
    },

    filter() {
      this.page = 1;
    },
  },
};
</script>
