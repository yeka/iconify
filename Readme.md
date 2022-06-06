# Iconify Plugin for Vite Svelte

[Iconify](https://iconify.design) is a collection of svg icons you can use on your projects.

This plugin is an alternative of `@iconify/svelte`.

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