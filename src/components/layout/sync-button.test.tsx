import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SyncButton from "./sync-button";
import { it, describe, expect, vi } from "vitest";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

const { mockedUseApi } = vi.hoisted(() => {
  const mockDailyEntriesApi = {
    listDailyEntries: vi.fn().mockResolvedValue([
      {
        person: 0,
        internalTime: 0,
        billableProjectTime: 0,
        nonBillableProjectTime: 0,
        logged: 0,
        loggedProjectTime: 0,
        expected: 0,
        balance: 0,
        date: "2024-06-24",
        isVacation: true
      }
    ])
  };

  const mockSynchronizeApi = {
    synchronizeTimeEntries: vi.fn().mockResolvedValue({})
  };

  return {
    mockedUseApi: vi
      .fn()
      .mockReturnValue({ dailyEntriesApi: mockDailyEntriesApi, synchronizeApi: mockSynchronizeApi })
  };
});

const { mockedPersons } = vi.hoisted(() => {
  const mockPersons = [
    {
      id: 0,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
      active: true,
      language: "English",
      startDate: "2023-01-01",
      unspentVacations: 0,
      spentVacations: 0,
      minimumBillableRate: 0,
      keycloakId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  ];

  return {
    mockedPersons: vi.fn().mockReturnValue(mockPersons)
  };
});

vi.mock("src/hooks/use-api", () => {
  return { useApi: mockedUseApi };
});

vi.mock("jotai", () => ({
  atom: vi.fn(),
  useAtomValue: mockedPersons,
  useSetAtom: vi.fn().mockImplementation(() => vi.fn())
}));

describe("SyncButton Component", () => {
  it("Sync button exists", async () => {
    render(<SyncButton />);

    const element = screen.getByText("Sync");
    expect(element).toBeDefined();
  });

  it("Sync button is initially disabled", async () => {
    render(<SyncButton />);

    const button = screen.getByText("Sync").closest("button");
    expect(button).toBeDisabled();
  });

  it("Sync button gets enabled after useEffect runs", async () => {
    render(<SyncButton />);

    const button = screen.getByText("Sync").closest("button");
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  //not working
  //   it("Clicking the Sync button triggers the sync process", async () => {
  //     //const SyncDialog = await import("../contexts/sync-handler");
  //     render(
  //       <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={"fi"}>
  //         <SyncButton />
  //       </LocalizationProvider>
  //     );

  //     const button = screen.getByText("Sync").closest("button");
  //     await waitFor(() => expect(button).not.toBeDisabled());

  //     if (button) {
  //       fireEvent.click(button);
  //     }
  //   });
});
