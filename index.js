import fs from "fs"
import path from "path"

class Iconify {
    collections = []

    constructor() {
        let rawdata = fs.readFileSync(path.resolve("./node_modules/@iconify/json/collections.json"));
        this.collections = JSON.parse(rawdata);
        console.log("Iconify Loaded")
    }

    loadSet(setName) {
        if (this.collections[setName] === undefined) {
            throw "IconSet '" + setName + "' doesn't exists"
        }

        if (this.collections[setName].loaded == true) {
            return
        }

        this.collections[setName].loaded = true
        let rawdata = fs.readFileSync(path.resolve("./node_modules/@iconify/json/json/" + setName + ".json"));
        this.collections[setName].icons = JSON.parse(rawdata);
    }

    loadIcon(setName, name) {
        this.loadSet(setName)
        if (this.collections[setName].icons.icons[name] === undefined) {
            throw "Icon " + setName + ":" + name + " doesn't exists"
        }
        const icon = {
            width: this.collections[setName].icons.icons[name].width,
            height: this.collections[setName].icons.icons[name].height,
            path: this.collections[setName].icons.icons[name].body,
        }
        if (icon.width === undefined) {
            icon.width = this.collections[setName].icons.width
        }
        if (icon.height === undefined) {
            icon.height = this.collections[setName].icons.height
        }
        return icon
    }
}

function readDir(dir) {
    let files = []
    fs.readdirSync(dir, { withFileTypes: true })
        .map((f) => {
            if (!f.isDirectory()) {
                files.push(path.resolve(dir + f.name))
                return
            }
            readDir(dir + f.name + "/").map((f) => files.push(f))
        })
    return files
}

export default function (opt) {
    const iconRegex = /icon=\"([\w_-]+):([\w_-]+)\"/g
    const queryRegex = /(^|&)name=([\w_-]+):([\w_-]+)(&|$)/
    const extIncludes = [".html", ".ts", ".js", ".svelte"]

    let icons = {}
    let iconify = new Iconify()

    return {
        name: "MyPlugin",

        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req._parsedUrl.pathname != "/yeka/iconify") {
                    next()
                    return
                }

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
                } catch(err) {
                    res.statusCode = 404
                    res.end(JSON.stringify({"error":err}))
                }
            })
        },

        buildStart(options) {
            if (opt.mode == "development") {
                return
            }
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

            // 3. Check for valid icon set
            for (const setName of Object.keys(icons)) {        
                for (const name of Object.keys(icons[setName])) {
                    icons[setName][name] = iconify.loadIcon(setName, name)
                }
            }

            // 3. Build the compacted list -> inside load() hook
            // console.log(JSON.stringify(icons))
        },

        load(id) {
            if (id.slice(-16) == "/iconify/icon.ts") {
                if (opt.mode === "production") {
                    const data = fs.readFileSync(id, 'utf8');
                    let lines = data.split("\n")
                    lines[0] = "const icons = " + JSON.stringify(icons)
                    return lines.join("\n")
                }

                return fs.readFileSync(id.slice(0, -2) + "dev.ts", 'utf8');
            }
        },
    }
}
