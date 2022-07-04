import fs from "fs"
import path from "path"
import { Iconify } from "./src/iconify.js"
import { readDir } from "./src/functions.js"

const thisPackage = "@yeka/iconify"

function yekaIconify(opt) {
    const iconRegex = /icon=\"([\w_-]+):([\w_-]+)\"/g
    const queryRegex = /^\/assets\/iconify\/([\w_-]+):([\w_-]+)\.svg$/
    const extIncludes = [".html", ".ts", ".js", ".svelte"]
    const iconScriptName = '/assets/iconify.svg'

    if (!fs.existsSync(path.resolve("./node_modules/@iconify/json"))) {
        console.warn("" + thisPackage + " requires @iconify/json\n\nRun `npm i -D @iconify/json` to install it")
        throw "error"
    }

    let icons = {}
    let iconify = new Iconify()

    return {
        name: "yeka/iconify",

        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req._parsedUrl.pathname.startsWith('/assets/iconify/')) {
                    next()
                    return;
                }

                const m = req._parsedUrl.pathname.match(queryRegex)
                if (m == null) {
                    res.statusCode = 404
                    res.end()
                    return
                }

                const setName = m[1]
                const iconName = m[2]
                try {
                    const icon = iconify.loadIcon(setName, iconName)
                    let content = '<svg xmlns="http://www.w3.org/2000/svg">'
                    content += `<symbol id="id" viewBox="0 0 ${icon.width} ${icon.height}">${icon.path}</symbol>`
                    content += '</svg>'
                    res.writeHead(200, {
                        'Content-Type': 'image/svg+xml',
                        'Content-Length': content.length
                    });
                    res.end(content)
                } catch (err) {
                    console.log(err)
                    res.statusCode = 404
                    res.end(JSON.stringify({ "error": err }))
                }
                return

            })
        }, //*/

        load(id) {
            if (opt.mode === "production") {
                return
            }
            if (!id.endsWith('@yeka/iconify/Icon.svelte')) return
            const content = fs.readFileSync(id, 'utf8')
            return content.replace(/\/assets\/iconify.svg#\{icon\}/, '/assets/iconify/{icon}.svg#id')
        },

        buildStart() {
            if (opt.mode !== "production") {
                return
            }

            // Find and collect icon declaration (eg: icon="fa:home")
            readDir("./src/").map((file) => {
                if (!extIncludes.includes(path.extname(file))) {
                    // console.log("unsupported extension: ", file)
                    return
                }

                const raw = fs.readFileSync(file)
                const matches = raw.toString().matchAll(iconRegex)
                for (const match of matches) {
                    const iconSet = match[1]
                    const iconName = match[2]
                    if (icons[iconSet] === undefined) {
                        icons[iconSet] = {}
                    }
                    icons[iconSet][iconName] = {}
                }
            })

            // Collect used icon
            for (const setName of Object.keys(icons)) {
                for (const name of Object.keys(icons[setName])) {
                    icons[setName][name] = iconify.loadIcon(setName, name)
                }
            }

            let content = '<svg xmlns="http://www.w3.org/2000/svg">'

            for (const setName of Object.keys(icons)) {
                for (const name of Object.keys(icons[setName])) {
                    const icon = icons[setName][name];
                    content += `<symbol id="${setName}:${name}" viewBox="0 0 ${icon.width} ${icon.height}">${icon.path}</symbol>`
                }
            }

            content += '</svg>'

            this.emitFile({
                type: 'asset',
                fileName: iconScriptName.slice(1),
                source: content,
            })
        }
    }
}

export default yekaIconify;