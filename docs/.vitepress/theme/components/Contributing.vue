<script setup lang="ts">
import { VPHomeSponsors } from 'vitepress/theme'

/* const { data } = useSponsor() */
const friends = [{
  avatar: "https://avatars.githubusercontent.com/u/58922004?v=4",
  githubHome: "https://github.com/pkc918",
  githubName: "青椒肉丝"
},{
  avatar: "https://avatars.githubusercontent.com/u/55641773?v=4",
  githubHome: "https://github.com/Alfred-Skyblue",
  githubName: "远方os",
},{
  avatar: "https://avatars.githubusercontent.com/u/72547426?v=4",
  githubHome: "https://github.com/Coder-XiaoZhuang",
  githubName: "better"
}]
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
    <li class="w-1/8 cursor-pointer" v-for="friend in friends" :key="friend.githubHome" >
      <a
          :href="friend.githubHome"
          target="_blank"
          rel="noreferrer"
      >
        <img class="rd-full" :src="friend.avatar" alt="">
        <p class="text-center mt-4 font-500">{{friend.githubName}}</p>
      </a>
    </li>
  </ul>
</template>

<style scoped>

</style>
