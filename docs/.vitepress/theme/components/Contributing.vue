<script setup lang="ts">
import { VPHomeSponsors } from 'vitepress/theme'
import { friends } from "../../../friends";
</script>

<template>
  <VPHomeSponsors
      message="感谢每个为 go.cn 做出贡献的人 !"
      :data="[]"
  />
  <div class="mb-15">
    <p class="w-full flex justify-center items-center text-5 font-600">友友链接！</p>
  </div>
  <ul class="flex flex-wrap w-full sm:w-2/3 md:1/3 mx-auto gap-20">
    <li class="cursor-pointer" v-for="{githubHome,avatar,githubName } of friends" :key="githubHome">
      <a
          :href="githubHome"
          target="_blank"
          rel="noreferrer"
      >
        <img class="rd-full w-50 h-50" :src="avatar" alt="">
        <p class="text-center mt-4 font-500">{{ githubName }}</p>
      </a>
    </li>
  </ul>
</template>

<style scoped>

</style>
