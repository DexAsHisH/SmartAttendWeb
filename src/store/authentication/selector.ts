import { createSelector } from 'reselect';

const authenticationState = (state : any) => state.authentication;

export const isAuthenticatedSelector = createSelector(authenticationState, (auth) => {
    return auth.authenticated;
  });

  export const payloadSelector = createSelector(authenticationState, ({ payload }) => {
    return payload;
  });
  export const userIdSelector = createSelector(authenticationState, ({ payload }) => {
    return payload?.identity.user_id;
  });
  
  export const hasAccessSelector = createSelector(authenticationState, isAuthenticatedSelector, ({ payload }, authenticated) => {
    return payload?.identity.first_password_update === true && authenticated;
  });