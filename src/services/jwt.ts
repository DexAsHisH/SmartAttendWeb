import { get, store } from '../utils/session-store-helper';
import { isPast, toDate } from 'date-fns';

const AUTH_TOKENS_KEY = 'messenger.authentication';
const AUTH_PAYLOAD_KEY = 'messenger.authentication.payload';

const readTokens = () => {
    return get(AUTH_TOKENS_KEY) || null;
  };
  

  export const readAccessToken = ()=> {
    const tokens = readTokens();
    return tokens?.access;
  };

  export const readPayload = () => {
    return get(AUTH_PAYLOAD_KEY) || null;
  };
  
  export const saveSession = (tokens: unknown, payload: unknown) => {
    store(AUTH_TOKENS_KEY, tokens);
    store(AUTH_PAYLOAD_KEY, payload);
  };

  export const clearActiveSession = () => {
    // we clear all session storage to clean up the session completely
    window.sessionStorage.clear();
  };

  export const isExpiredAccessToken = () => {
    const payload = readPayload();
    const exp = payload?.exp || 0;
    const expireDate = new Date(exp * 1000);
    return isPast(expireDate);
  };

  export const closeClientSession = () => {
    clearActiveSession();
    window.location.href = '/login';
  };

  export const parseJwt = (token: string) => {
    const splitToken = token.split('.');
    if (splitToken.length < 2) {
      return { identity: { prm: [] }, exp: 0 };
    }
    const encryptedPayload = splitToken[1];
    const payloadJson = decodeURIComponent(
      atob(encryptedPayload)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
  
    return JSON.parse(payloadJson) ;
  };
  
  export const getExpirationDate = (token: any) => {
    const data = parseJwt(token);
    return toDate(data.exp * 1000);
  };
  
  export const getClientId = () => {
    const payload = readPayload();
    return payload?.identity?.client_id || '';
  };
  