import { createSelector } from 'reselect';

const userDetailsState = (state : any) => state.userDetails;

export const userDetailsSelector = createSelector(userDetailsState, (userDetails) => {
    return userDetails;
  });

