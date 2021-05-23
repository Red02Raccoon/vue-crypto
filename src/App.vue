<template>
  <div class="container px-4 mb-4 mx-auto">
    <header
      class="flex items-center w-full border-b-2 border-gray-100 p-4 mb-4"
    >
      <logo-img>Vuejs</logo-img>
      <nav-menu class="ml-auto"></nav-menu>
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import LogoImg from "@/components/Logo.vue";
import NavMenu from "@/components/NavMenu.vue";

export default {
  components: { LogoImg, NavMenu },
};
</script>
