<template>
  <nav class="navigation">
    <ul class="navigation-list flex items-center">
      <router-link
        v-for="{ name, title } in config"
        :key="name"
        :to="{ name }"
        v-slot="{ navigate, href, isActive }"
        custom
      >
        <li
          class="navigation-list__item px-2 ml-1"
          :class="{ active: isActive }"
        >
          <a :href="href" @click="navigate">{{ title }}</a>
        </li>
      </router-link>
    </ul>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      config: [
        {
          title: "Crypto App",
          name: "crypto",
        },

        {
          title: "Test App",
          name: "test",
        },
      ],
    };
  },
};
</script>
<style scoped>
.navigation-list__item {
  position: relative;
}

.navigation-list__item:after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  height: 3px;
  width: 0;
  background-color: rgb(139, 92, 246);
  transition: width 0.5s;
}

.navigation-list__item.active:after {
  width: 100%;
}
</style>
