import {
    IMAGES_COUNT,
    SKETCHES_COUNT,
    VIDEOS_COUNT,
    DOCUMENTS_COUNT,
    LINKS_COUNT,
    NOTES_COUNT,
    AUDIOS_COUNT,
    LOGOUT,
    TOTAL
} from '../Types/Index';

const initialState = {
    NoOfImages: null,
    NoOfSketches: null,
    NoOfVideos: null,
    NoOfDocs: null,
    NoOfLinks: null,
    NoOfNotes: null,
    NoOfAudios: null,
    Total: null
};
const AssetCountReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGOUT:
            return initialState;
        case IMAGES_COUNT:
            return {
                ...state,
                NoOfImages: action.payload,
            };
        case SKETCHES_COUNT:
            return {
                ...state,
                NoOfSketches: action.payload,
            };
        case VIDEOS_COUNT:
            return {
                ...state,
                NoOfVideos: action.payload,
            };
        case DOCUMENTS_COUNT:
            return {
                ...state,
                NoOfDocs: action.payload,
            };
        case LINKS_COUNT:
            return {
                ...state,
                NoOfLinks: action.payload,
            };
        case NOTES_COUNT:
            return {
                ...state,
                NoOfNotes: action.payload,
            };
        case AUDIOS_COUNT:
            return {
                ...state,
                NoOfAudios: action.payload,
            };
        case TOTAL:
            return {
                ...state,
                Total: action.payload,
            };

        default:
            return state;
    }
};

export { AssetCountReducer };
