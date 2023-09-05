import { atom } from 'jotai'
import { getApiClient } from '../../api/api'
import { authAtom } from './Auth';

export const apiClientAtom = atom((get) => getApiClient(get(authAtom)?.tokenRaw));