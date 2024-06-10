import { atom } from "jotai";
import type { Allocations, Projects } from "src/generated/homeLambdasClient";

export const timeEntriesAtom = atom<number[]>([]);
export const allocationsAtom = atom<Allocations[]>([]);
export const projectsAtom = atom<Projects[]>([]);