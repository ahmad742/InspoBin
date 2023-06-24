import { ASSET_NAME, KEYWORD, LOGOUT } from '../Types/Index';

const initialState = {
  assetName: null,
  keyword: null
};
const AssetKeywordReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case ASSET_NAME:
      return {
        ...state,
        assetName: action.payload,
      };
    case KEYWORD:
      return {
        ...state,
        keyword: action.payload,
      };

    default:
      return state;
  }
};

export { AssetKeywordReducer };
