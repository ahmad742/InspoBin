import { HAS_SESSION, REGISTRATION_DATA, LOGOUT } from '../Types/Index';

const initialState = {
    loginUserData: null,
    registrationData: null
};

const AuthReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGOUT:
            return initialState
        case HAS_SESSION:
            return {
                ...state,
                loginUserData: action.payload,
            };
        case REGISTRATION_DATA:
            return {
                ...state,
                registrationData: action.payload,
            };
        default:
            return state;
    }
} 

export { AuthReducer }