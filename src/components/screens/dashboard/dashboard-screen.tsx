import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { Person, PersonTotalTime } from "../../../generated/client";
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
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const { personsApi } = useApi();
  const [fetchedPersona, setFetchedPersona] = useState<Person[] | undefined>(); 
  
/**
 * Initialize logged in person's time data.
 */
  const getPersons = async () => {
    setIsLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    // const loggedInPerson = fetchedPersons.filter(person => person.keycloakId === userProfile?.id);

    // if (loggedInPerson.length) {
      try {
          const fetchedPerson = await personsApi.listPersonTotalTime({personId: fetchedPersons[1].id});
          setFetchedPersona(fetchedPersons);
          setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${ "Person fetch has failed." }, ${ error }`);
      }
    // }
    // else {
    //   setError("Your account does not have any time bank entries.");
    // }
    setIsLoading(false);
  }

  useEffect(() => {
    getPersons();
  }, [ auth ])
  

  return (
    <LoaderWrapper loading={isLoading}>
      <div>
        {(personTotalTime) ?`Your balance is ${ getHoursAndMinutes(Number(personTotalTime?.balance)) }` : null }
      </div>
      <div>
        {fetchedPersona ? fetchedPersona[1].firstName : null}
      </div>
      <button type="button" onClick={() => auth?.logout()}>Log out</button>
    </LoaderWrapper>
  );
}

export default DashboardScreen;