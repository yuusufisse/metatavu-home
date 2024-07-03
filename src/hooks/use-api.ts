import { useAtomValue } from "jotai";
import { apiClientAtom, apiLambdasClientAtom } from "../atoms/api";

export const useApi = () => useAtomValue(apiClientAtom);
export const useLambdasApi = () => useAtomValue(apiLambdasClientAtom);