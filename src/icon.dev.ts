async function get(name: string): Promise<{ width: number, height: number, path: string }> {
    return fetch("/yeka/iconify?name=" + name)
        .then(res => res.json())
        .then(res => { return res })
        .catch((err) => {
            throw err
        })
}

export { get }