import { DefaultTheme, defineConfig } from "vitepress";
import UnoCSS from "unocss/vite";


const WhyGo: (DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink)[] = [
  {text: "Case Studies", link: "/"},
  {text: "Use Cases", link: "/"},
  {text: "Security", link: "/"}
];
const Docs: (DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink)[] = [
  {text: "Effective Go", link: "/"},
  {text: "Go User Manual", link: "/"},
  {text: "Standard library", link: "/"},
  {text: "Release Notes", link: "/"},
];
const Community: (DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink)[] = [
  {text: "Recorded Talks", link: "/"},
  {text: "Meetups", link: "/"},
  {text: "Conferences", link: "/"},
  {text: "Go 博客", link: "/"},
  {text: "Go 项目", link: "/"},
];
// 导航
const nav: DefaultTheme.NavItem[] = [
  {text: "Why Go", items: WhyGo},
  {text: "Learn", link: "/"},
  {text: "Docs", items: Docs},
  {text: "Packages", link: "/"},
  {text: "Community", items: Community},
];
const sidebar = {
  '/guide': [{
    text: '你好', items: nav
  }]
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/go.cn/',
  title: " ",
  description: "Go是一个开源的编程语言，可以轻松构建简单、可靠且高效的软件。",
  themeConfig: {
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav,

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/golang' },
      { icon: 'twitter', link: 'https://x.com/golang?mx=2' },
    ]
  },
  vite: {
    plugins: [UnoCSS()],
  }
})
