import { useEffect, useMemo, useState } from "react";
import { Person } from "src/generated/client";
import { CircularProgress, Card } from "@mui/material";
import { userProfileAtom } from "src/atoms/auth";
import { useAtomValue } from "jotai";
import { personsAtom } from "src/atoms/person";
import VacationTimeOverrideContent from "../vacation-time-override/vacation-time-override-content";
import config from "src/app/config";

/**
 * vacation Time Override component.
 */
const vacationTimeOverrideScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const persons = useAtomValue(personsAtom);
  const loggedInPerson = persons.find(
    (person: Person) =>
      person.id === config.person.forecastUserIdOverride || person.keycloakId === userProfile?.id
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(loggedInPerson?.id);

  const selectedPerson = persons.find((person: Person) => person.id === selectedEmployeeId);

  useEffect(() => {
    if (loggedInPerson) {
      setSelectedEmployeeId(loggedInPerson.id);
    }
  }, [loggedInPerson]);

  return (
    <div>
      <div style={{ marginTop: "16px" }} />
      {!selectedEmployeeId ? (
        <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
          {<CircularProgress sx={{ scale: "150%" }} />}
        </Card>
      ) : (
        <VacationTimeOverrideContent
          selectedPerson={selectedPerson}
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
        />
      )}
    </div>
  );
};

export default vacationTimeOverrideScreen;
