import { useAtomValue } from "jotai";
import { apiClientAtom } from "../components/atoms/Api";

export const useApi = () => useAtomValue(apiClientAtom);
