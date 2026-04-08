import { combineReducers } from 'redux';

import customizationReducer from './customizationReducer';
import timezoneReducer from './timezoneSlice';

const reducer = combineReducers({
  customization: customizationReducer,
  timezone: timezoneReducer
});

export default reducer;
