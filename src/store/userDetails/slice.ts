import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
    name : 'USER_DETAILS',
    initialState: {
        name : null,
        userId: null,
        image: null,
        username: null,
        email: null,
        token: null,
        firstName: null,
        lastName: null,
        role: null
    },
    reducers : {
        setUserDetails : (state, action) => {
            state.userId = action.payload.user_id
            state.name = action.payload.name
            state.image = action.payload.image
            state.email = action.payload.email
            state.username = action.payload.username
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
            state.role = action.payload.role
        }   
    }
})



export const userDetailsReducer = reducer;
export const { setUserDetails } = actions