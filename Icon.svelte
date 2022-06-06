<script>
    import {get} from "./src/icon"

    export let icon = ""
    let req = get(icon)
    let res = undefined
    req.then(out => {
        if (out === undefined || out.path == undefined) {
            console.warn("Icon " + icon + " not found!")
            return
        }
        res = out
    })
</script>

{#await req}
<!-- Nothing here -->
{:then}
{#if res != undefined}
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" viewBox="0 0 {res.width} {res.height}" class="iconify iconify--mdi-light">
    {@html res.path}
</svg>
{/if}
{/await}
