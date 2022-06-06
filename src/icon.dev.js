async function getIcon(name) {
    return fetch("/yeka/iconify?name=" + name)
        .then(res => res.json())
        .then(res => { return res })
        .catch((err) => { throw err })
}