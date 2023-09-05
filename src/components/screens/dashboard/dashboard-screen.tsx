import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { PersonTotalTime } from "../../../generated/client";
import { errorAtom } from "../../../atoms/error";

/**
 * Dashboard screen component
 * 
 */
function DashboardScreen () {
  const auth = useAtomValue(authAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime[]>();
  const { personsApi } = useApi();
  
/**
 * Initialize logged in person's time data.
 * 
 */
  const getPersons = async () => {
    setIsLoading(true);
    //NOTE: Trainees do not have time bank entries, therefore a use keycloak ID from another employee for testing.
    const loggedInPerson = await (await personsApi.listPersons({ active: true })).filter(person => person.keycloakId === userProfile?.id)

    if (loggedInPerson.length > 0) {
      try {
        if (auth?.tokenRaw){
          const fetchedPerson : PersonTotalTime[] = await personsApi.listPersonTotalTime({personId: loggedInPerson[0].id});
          setPersonTotalTime(fetchedPerson);
        }
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
    <>{(isLoading)
      ?<div>Loading...</div>
      :<div>
        <div>{personTotalTime?.map((person) => {
          return (`Your balance is ${Math.trunc(person.balance / 60)} h ${(person.balance % 60) * -1} min`)
      })}</div>
      </div>
    }</>
  );
}

export default DashboardScreen;