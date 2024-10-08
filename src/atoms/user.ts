import { atom } from "jotai"
import type { UsersApi } from "../generated/homeLambdasClient"

export const usersAtom = atom<UsersApi[]>([]);