import { DefaultTheme, defineConfig } from "vitepress";
import UnoCSS from "unocss/vite";


const WhyGo: (DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink)[] = [
  {text: "Case Studies", link: "/"},
  {text: "Use Cases", link: "/"},
  {text: "Security", link: "/"}
];
const Docs: (DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink)[] = [
  {text: "Effective Go", link: "/docs/effective-go/menus"},
  {text: "Go User Manual", link: "/"},
  {text: "Standard library", link: "/"},
  {text: "Release Notes", link: "/"},
];
const DocsContent: (DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink)[] = [
  {text: "整体目录", link: "/docs/effective-go/menus"},
  {text: "介绍", link: "/docs/effective-go/introduction"},
  {text: "格式化", link: "/docs/effective-go/formatting"},
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
  "/docs": [{
    text: "Go文档", items: DocsContent
  }]
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/go.cn/',
  title: " ",
  description: "Go是一个开源的编程语言，可以轻松构建简单、可靠且高效的软件。",
  themeConfig: {
    logo: "/logo.svg",
    outline: [2, 3],
    // https://vitepress.dev/reference/default-theme-config
    nav,

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/golang' },
      { icon: 'twitter', link: 'https://x.com/golang?mx=2' },
    ],
  },
  vite: {
    plugins: [UnoCSS()],
  }
})
