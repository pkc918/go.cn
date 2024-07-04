<script setup>
import Theme from 'vitepress/theme'
import Contributing from "./components/Contributing.vue";

const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <img src="/go.svg" alt="">
    </template>
    <template #home-features-after>
      <Contributing/>
    </template>
  </Layout>
</template>
