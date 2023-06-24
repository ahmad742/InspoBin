import { USER_PROFILE, LOGOUT } from '../Types/Index';

const initialState = {
    profileData: null
};

const ProfileReducer = (state = initialState, action = {}) => {
    // console.log("In profile reducer.....",action.payload)
    switch (action.type) {
        case LOGOUT:
            return initialState;
        case USER_PROFILE:
            return {
                ...state,
                profileData: action.payload,
            };
        default:
            return state;
    }
}

export { ProfileReducer }