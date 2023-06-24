import { USER_ASSET, ASSET_LIST, SELECTED_INDEX } from '../Types/Index';

const Assets = payload => ({
  type: USER_ASSET,
  payload,
});
const AssetsList = payload => ({
  type: ASSET_LIST,
  payload,
});
const SelectedItemIndex = payload => ({
  type: SELECTED_INDEX,
  payload,
});

export { Assets, AssetsList, SelectedItemIndex }
