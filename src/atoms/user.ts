import { atom } from "jotai"
import type { UsersApi } from "src/generated/client"

export const usersAtom = atom<UsersApi[]>([]);