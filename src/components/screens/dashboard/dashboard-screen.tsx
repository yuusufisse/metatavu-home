import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { PersonTotalTime } from "../../../generated/client";
import { errorAtom } from "../../../atoms/error";
import LoaderWrapper from "../../generics/loader-wrapper";
import { getHoursAndMinutes } from "../../../utils/time-utils";

/**
 * Dashboard screen component
 */
function DashboardScreen () {
  const auth = useAtomValue(authAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime[]>([]);
  const { personsApi } = useApi();
  
/**
 * Initialize logged in person's time data.
 */
  const getPersons = async () => {
    setIsLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter(person => person.keycloakId === userProfile?.id);

    if (loggedInPerson.length) {
      try {
          const fetchedPerson : PersonTotalTime[] = await personsApi.listPersonTotalTime({personId: loggedInPerson[0].id});
          setPersonTotalTime(fetchedPerson);
      } catch (error) {
        setError(`${ "Person fetch has failed." }, ${ error }`);
      }
    }
    else {
      setError("Your account does not have any time bank entries.");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getPersons();
  }, [auth])
  

  return (
    <LoaderWrapper loading={isLoading}>
        <div>{personTotalTime.map((person) => {
          return (`Your balance is ${getHoursAndMinutes(person.balance)}`)
      })}</div>
        <button type="button" onClick={() => auth?.logout()}>Log out</button>
    </LoaderWrapper>
  );
}

export default DashboardScreen;