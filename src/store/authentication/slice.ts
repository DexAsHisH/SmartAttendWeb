

import { createSlice } from "@reduxjs/toolkit";
import {readAccessToken, readPayload } from '../../services/jwt'

const initialState = {
    authenticated: false,
    payload: readPayload(),
  };

const { reducer, actions } = createSlice({
    name : 'AUTH',
    initialState,
    reducers : {
        setAuthenticated : (state: { authenticated: any; }, action: { payload: any; } ) => {
            state.authenticated = action.payload;
        }
    },
});

export const {setAuthenticated} = actions;

export const authenticationReducer = reducer;