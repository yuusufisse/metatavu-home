import { atom } from "jotai"
import type { UsersApi } from "src/generated/homeLambdasClient/apis"

export const usersAtom = atom<UsersApi[]>([]);