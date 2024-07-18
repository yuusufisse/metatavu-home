import { act, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest';
import { atom } from 'jotai';
import type { KeycloakProfile } from 'keycloak-js';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import BalanceCard from 'src/components/home/balance-card';
import type { Person, PersonTotalTime } from 'src/generated/client';
import { TESTING } from 'src/utils/sprint-utils';
import { useApi } from 'src/hooks/use-api';

vi.mock("src/utils/user-role-utils", () => {
  const UserRoleUtils = {
    adminMode: vi.fn().mockReturnValue(false)
  }
  return {
    default: UserRoleUtils
  };
})

vi.mock("src/atoms/person", async () => {
  const {mockPersons} = await import("../generics/person-mocks");
  return {
    personsAtom: atom<Person[]>(mockPersons),
    personTotalTimeAtom: atom<PersonTotalTime | undefined>(undefined)
  }
})

vi.mock("src/atoms/auth", async (importOriginal) => {
  const auth = await importOriginal<typeof import('src/atoms/auth')>()
  return {
    ...auth,
    userProfileAtom: atom<KeycloakProfile | undefined>({id: "3"})
  }
})

vi.mock("src/hooks/use-api", async (importOriginal) => {
  const {mockPersonTotalTime} = await import("../generics/person-mocks");
  const useApi = await importOriginal<typeof import('src/hooks/use-api')>()
  return {
    useApi: () => ({
      ...useApi,
      personsApi: {
        listPersonTotalTime: vi.fn().mockReturnValue(mockPersonTotalTime)
      }
    })
  }
})

vi.mock("src/utils/sprint-utils", () => {
  return {
    TESTING: vi.fn().mockReturnValue("testing")
  }
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <BalanceCard />,
  }
]);

describe("Test balnce card component", async () => {
  it("Renders", async () => {
    await act(async() => {
      render(<RouterProvider router={router} />);
    });
    
    await waitFor(() => {
      expect(useApi().personsApi.listPersonTotalTime).toHaveBeenCalled();
    });
  })
})