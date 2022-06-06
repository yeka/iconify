import fs from "fs"
import path from "path"
import { Iconify } from "./src/iconify.js"
import { readDir } from "./src/functions.js"

const thisPackage = "@yeka/iconify"

function yekaIconify(opt) {
    const iconRegex = /icon=\"([\w_-]+):([\w_-]+)\"/g
    const queryRegex = /(^|&)name=([\w_-]+):([\w_-]+)(&|$)/
    const extIncludes = [".html", ".ts", ".js", ".svelte"]
    const iconScriptName = '/assets/iconify.js'
    const iconFile = "/" + thisPackage + "/src/icon.ts"

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
                switch (req._parsedUrl.pathname) {
                    case "/yeka/iconify":
                        const m = req._parsedUrl.query.match(queryRegex)
                        if (m == null) {
                            res.statusCode = 404
                            res.end()
                            return
                        }

                        const setName = m[2]
                        const iconName = m[3]
                        try {
                            const icon = iconify.loadIcon(setName, iconName)
                            res.end(JSON.stringify(icon))
                        } catch (err) {
                            res.statusCode = 404
                            res.end(JSON.stringify({ "error": err }))
                        }
                        break

                    case iconScriptName:
                        res.end(fs.readFileSync("./node_modules/" + thisPackage + "/src/icon.dev.js", 'utf8'))
                        break

                    default:
                        next()
                }
            })
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

            const data = fs.readFileSync(path.resolve("./node_modules/" + thisPackage + "/src/icon.js"), 'utf8');
            let lines = data.split("\n")
            lines[0] = "const icons = " + JSON.stringify(icons)
            const content = lines.join("\n")

            this.emitFile({
                type: 'asset',
                fileName: iconScriptName.slice(1),
                source: content,
            })
        },

        transformIndexHtml(html) {
            return html.replace(/<\/head>/, `  <script src="` + iconScriptName + `"></script>\n  </head>`);
        }
    }
}

export default yekaIconify;