import type { Theme } from 'vitepress'
import VPTheme from 'vitepress/theme'

import 'uno.css'

import GoLayout from './GoLayout.vue'

export default {
    ...VPTheme,
    Layout: GoLayout,
} satisfies Theme
