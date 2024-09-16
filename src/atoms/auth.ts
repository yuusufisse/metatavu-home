import { atom } from "jotai";
import type { KeycloakProfile, KeycloakTokenParsed } from "keycloak-js";

export type Auth = {
  tokenRaw: string | undefined;
  logout: () => void;
  token: KeycloakTokenParsed | undefined;
};

export const authAtom = atom<Auth | undefined>(undefined);
export const userProfileAtom = atom<KeycloakProfile | undefined>(undefined);
