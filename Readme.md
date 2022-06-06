# Iconify Plugin for Vite Svelte


`vite.config.ts`
```js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { yekaIconify } from 'vite-plugin-svelte-iconify'

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
    import Icon from 'vite-plugin-svelte-iconify/Icon.svelte'
</script>

<Icon icon="mdi:home" />
```

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