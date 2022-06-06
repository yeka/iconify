import fs from "fs"
import path from "path"

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

export { readDir }