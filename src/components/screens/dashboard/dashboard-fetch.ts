import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { errorAtom } from "../../../atoms/error";
import { personAtom } from "../../../atoms/person";
import { Timespan, PersonTotalTime } from "../../../generated/client";
import { useApi } from "../../../hooks/use-api";
import config from "../../../app/config";
import { userProfileAtom } from "../../../atoms/auth";

const DashboardFetch = (timespan? : Timespan) => {
  const setError = useSetAtom(errorAtom);
  const { personsApi } = useApi();
  const [person, setPerson] = useAtom(personAtom);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const userProfile = useAtomValue(userProfileAtom);

  useEffect(() => {
    if (person) getPersonData();
    else getLoggedInPerson();
  }, [person]);

  /**
   * Get logged in person from keycloak ID.
   */
  const getLoggedInPerson = async (): Promise<void> => {
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter(
      (person) => person.keycloakId === config.keycloak.id || userProfile?.id
    )[0];
    setPerson(loggedInPerson);
  };

  /**
   * Initialize logged in person's time data.
   */
  const getPersonData = async (): Promise<void> => {
    if (person) {
      try {
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: person?.id,
          timespan: timespan
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${"Person fetch has failed."}, ${error}`);
      }
    } else {
      setError("Your account does not have any time bank entries.");
    }
  };

  return { personTotalTime };
};

export default DashboardFetch;
