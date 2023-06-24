import { combineReducers } from 'redux';

import { AuthReducer } from './AuthReducer';
import { ProfileReducer } from './ProfileReducer';
import { AssetReducer } from './AssetsReducer';
import { AssetKeywordReducer } from './Asset_KeywordReducer'
import {AssetCountReducer} from './AssetCountReducer'
import {SubscriptionReducer} from './SubscriptionReducer'

const rootReducer = combineReducers({
  Auth: AuthReducer,
  Profile: ProfileReducer,
  Assets: AssetReducer,
  FilterAsset: AssetKeywordReducer,
  AssetCount: AssetCountReducer,
  Subscription: SubscriptionReducer
});

export default rootReducer;
