import fs from "fs"
import path from "path"

class Iconify {
    collections = []

    constructor() {
        let rawdata = fs.readFileSync(path.resolve("./node_modules/@iconify/json/collections.json"));
        this.collections = JSON.parse(rawdata);
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

export { Iconify }