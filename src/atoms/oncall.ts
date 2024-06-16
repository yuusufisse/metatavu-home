import { atom } from "jotai";
import type { OnCall } from "src/generated/homeLambdasClient";

export const oncallAtom = atom<OnCall[]>([]);
