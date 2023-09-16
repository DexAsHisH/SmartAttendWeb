import { userDetailsReducer as userDetails } from './userDetails';
import {authenticationReducer as authentication } from './authentication'
import { combineReducers } from 'redux';

export const reducers = combineReducers({
    authentication,
    userDetails
})