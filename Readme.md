# Iconify Plugin for Vite Svelte

[Iconify](https://iconify.design) is a collection of svg icons you can use on your projects.

This plugin is an alternative of `@iconify/svelte`.

It will generate a single javascript library that contains only the icons that is used.
The Icon.svelte will make use of the javascript library to generate an inline svg icon.

Because it relies on javascript to generate the icon, there might be a delay before the icon shows up on the page.
## Install
```bash
npm i -D 'git+https://github.com/yeka/iconify.git#inline' '@iconify/json'
```

## Setup

`vite.config.ts`
```js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import yekaIconify from '@yeka/iconify/vite.js'

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [
    yekaIconify(env),
    svelte(),
  ]
}))
```

`App.svelte`
```html
<script>
    import Icon from '@yeka/iconify/Icon.svelte'
</script>

<Icon icon="mdi:home" />
```

You can search an icon from the huge collection of iconify here:
[https://icon-sets.iconify.design/](https://icon-sets.iconify.design/)


Optionally, you can controll the icon size using `.iconify` class in global css file.
```css
.iconify {
    width: 64px;
    height: 64px;
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px;
}
```


Some related article:

- https://chenhuijing.com/blog/the-many-methods-for-using-svg-icons/#%F0%9F%91%BE
