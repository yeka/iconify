<script>
    export let icon = ""
    export let width = "48"
    export let height = "48"
    let req = getIcon(icon)
    let res = undefined
    req.then(out => {
        if (out === undefined || out.path == undefined) {
            console.warn("Icon " + icon + " not found!")
            return
        }
        res = out
    })
</script>

{#if res !== undefined}
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" {width} {height} viewBox="0 0 {res.width} {res.height}" class="iconify iconify--mdi-light {$$props.class}">
    {@html res.path}
</svg>
{/if}