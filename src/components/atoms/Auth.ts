import { atom } from 'jotai';
import type { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';

export interface Auth {
    token: KeycloakTokenParsed
    tokenRaw: string
    logout: () => void
  }
  
export const authAtom = atom<Auth>({ 
    token: undefined, 
    tokenRaw: "", 
    logout: undefined 
});

export const userProfileAtom = atom<KeycloakProfile>({ 
    id: undefined,
	username: undefined,
	email: undefined,
	firstName: undefined,
	lastName: undefined,
	enabled: undefined,
	emailVerified: undefined,
	totp: undefined,
	createdTimestamp: undefined
});