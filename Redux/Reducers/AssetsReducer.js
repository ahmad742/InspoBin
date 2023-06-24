import { USER_ASSET, ASSET_LIST, SELECTED_INDEX, LOGOUT } from '../Types/Index';

const initialState = {
  userAssets: null,
  assetList: [],
  selectedIndex: null
};
const AssetReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case USER_ASSET:
      return {
        ...state,
        userAssets: action.payload,
      };
    case ASSET_LIST:
      return {
        ...state,
        assetList: action.payload
      }
    case SELECTED_INDEX:
      return {
        ...state,
        selectedIndex: action.payload
      }

    default:
      return state;
  }
};

export { AssetReducer };
