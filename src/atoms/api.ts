import { atom } from "jotai";
import { getApiClient, getLambdasApiClient } from "../api/api";
import { authAtom } from "./auth";

export const apiClientAtom = atom((get) => getApiClient(get(authAtom)?.tokenRaw));
export const apiLambasAtom = atom((get) => getLambdasApiClient(get(authAtom)?.tokenRaw));