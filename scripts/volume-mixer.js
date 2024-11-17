const getStoredVolume = () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get("volume", (data) => {
            resolve(data.volume || 0.5)
        })
    })
}

const createVolumeControl = (video) => {
    const inputMixer = document.createElement("input")
    inputMixer.type = "range"
    inputMixer.min = 0
    inputMixer.max = 1
    inputMixer.step = 0.05
    inputMixer.style.position = "absolute"
    inputMixer.style.zIndex = 10
    inputMixer.style.bottom = "2px"
    inputMixer.style.left = "10px"

    getStoredVolume().then((storedVolume) => {
        inputMixer.value = storedVolume
        video.volume = storedVolume
    })

    inputMixer.addEventListener("input", () => {
        const newVolume = inputMixer.value
        chrome.storage.sync.set({ volume: newVolume })
        setVolume(newVolume)
    })
    video.parentElement.style.position = "relative"
    video.parentElement.appendChild(inputMixer)
}

const setVolume = (volume) => {
    const videos = document.querySelectorAll("video")
    videos.forEach((video) => {
        video.volume = volume
    })

    const mixers = document.querySelectorAll("input[type='range']")
    mixers.forEach((mixer) => {
        mixer.value = volume
    })
}

const processNewVideos = () => {
    const newVideos = document.querySelectorAll("video:not([data-processed])")
    newVideos.forEach((video) => {
        createVolumeControl(video)
        video.setAttribute("data-processed", true)
    })
}

setInterval(processNewVideos, 1000)

window.addEventListener("DOMContentLoaded", () => {
    getStoredVolume().then((storedVolume) => {
        setVolume(storedVolume)
    })
})
