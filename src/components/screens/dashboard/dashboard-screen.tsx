import { useAtomValue } from "jotai";
import { authAtom, userProfileAtom } from "../../atoms/Auth";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { PersonTotalTime } from "../../../generated/client";

/**
 * Dashboard screen component
 * 
 */
function DashboardScreen () {
  const auth = useAtomValue(authAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime[]>();
  const { personsApi } = useApi();
  
/**
 * Initialize logged in person's time data.
 * 
 */
  const getPersons = async () => {
    setIsLoading(true);
    //NOTE: Trainees do not have time bank entries, therefore a use keycloak ID from another employee for testing.
    const loggedInPerson = await (await personsApi.listPersons({ active: true })).filter(person => person.keycloakId === userProfile.id)

    if (loggedInPerson.length > 0) {
      try {
          const fetchedPerson : PersonTotalTime[] = await personsApi.listPersonTotalTime({personId: loggedInPerson[0].id});
          setPersonTotalTime(fetchedPerson);

      } catch (error) {
        console.error(error);
      }
    }
    else {
      setErrorMsg("Your account does not have any time bank entries.")
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getPersons();
  }, [auth])
  

  return (
    <>{(isLoading)
      ?<div>Loading...</div>
      :(errorMsg) 
      ?<div>{errorMsg}</div>
      :<div>
        <div>{personTotalTime?.map((person) => {
          return (`Your balance is ${Math.trunc(person.balance / 60)} h ${(person.balance % 60) * -1} min`)
      })}</div>
      </div>
    }</>

const DashboardScreen = () => {
  const [auth] = useAtom(authAtom);

  return (
    <div>
      <div>This is where we would put our dashboard! IF WE HAD ONE!</div>
      <button type="button" onClick={ auth?.logout }>Log out</button>
    </div>
  );
}

export default DashboardScreen;