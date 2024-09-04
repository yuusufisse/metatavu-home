import { atom } from "jotai"
import type { User } from "src/generated/client"

export const usersAtom = atom<User[]>([]);