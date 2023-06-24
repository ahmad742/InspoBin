import {
    IMAGES_COUNT,
    SKETCHES_COUNT,
    VIDEOS_COUNT,
    DOCUMENTS_COUNT,
    LINKS_COUNT,
    NOTES_COUNT,
    AUDIOS_COUNT,
    TOTAL
} from '../Types/Index'


const imageCount = (payload) => ({
    type: IMAGES_COUNT,
    payload
})
const sketchCount = (payload) => ({
    type: SKETCHES_COUNT,
    payload
})
const videoCount = (payload) => ({
    type: VIDEOS_COUNT,
    payload
})
const docCount = (payload) => ({
    type: DOCUMENTS_COUNT,
    payload
})
const linkCount = (payload) => ({
    type: LINKS_COUNT,
    payload
})
const noteCount = (payload) => ({
    type: NOTES_COUNT,
    payload
})
const audioCount = (payload) => ({
    type: AUDIOS_COUNT,
    payload
})
const total = (payload) => ({
    type: TOTAL,
    payload
})

export { imageCount, sketchCount, videoCount, docCount, linkCount, noteCount, audioCount, total }