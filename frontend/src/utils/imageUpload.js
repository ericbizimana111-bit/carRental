export const readImageAsDataUrl = file => new Promise((resolve, reject) => {
    if (!file) return resolve('')
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
})

export const compressImage = file => new Promise((resolve, reject) => {
    if (!file) return resolve('')
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = event => {
        const image = new Image()
        image.onerror = reject
        image.onload = () => {
            const maxDimension = 1600
            const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
            const canvas = document.createElement('canvas')
            canvas.width = Math.max(1, Math.round(image.width * scale))
            canvas.height = Math.max(1, Math.round(image.height * scale))
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL('image/jpeg', 0.82))
        }
        image.src = event.target.result
    }
    reader.readAsDataURL(file)
})