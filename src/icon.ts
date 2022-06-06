const icons = {} // it will be replaced by build script

async function get(name: string): Promise<{ width: number, height: number, path: string }> {
    const p = name.split(":")
    if (icons[p[0]] === undefined) {
        console.warn("Icon Set "+p[0]+" doesn't exists")
        return undefined
    }
    if (icons[p[0]][p[1]] === undefined) {
        console.warn("Icon "+name+" doesn't exists")
        return undefined
    }
    return icons[p[0]][p[1]]
}

export { get }