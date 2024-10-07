import { atom } from "jotai"
import type { UsersApi } from "src/generated/homeLambdasClient"

export const usersAtom = atom<UsersApi[]>([]);