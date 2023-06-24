import { SUBSCRIPTION, SUBSCRIBED_PACKAGE, RECEIPT, STORAGE, LOGOUT } from '../Types/Index';

const initialState = {
    packages: null,
    subscribedPackage: null,
    receipt: null,
    storage:null
};

const SubscriptionReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        // case LOGOUT:
        //     return initialState;
        case SUBSCRIPTION:
            return {
                ...state,
                packages: action.payload,
            };

        case SUBSCRIBED_PACKAGE:
            return {
                ...state,
                subscribedPackage: action.payload,
            };
        case RECEIPT:
            return {
                ...state,
                receipt: action.payload,
            };
            case STORAGE:
                return {
                    ...state,
                    storage: action.payload,
                };
        default:
            return state;
    }
}

export { SubscriptionReducer }