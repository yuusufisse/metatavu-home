import { Person, VacationRequest } from "../generated/client";
import { KeycloakProfile } from "keycloak-js";
import strings from "../localization/strings";

/**
 * Get vacation request person full name
 * Match keycloak id from persons with vacationrequest id or user profile id
 *
 * @param props component properties
 * @returns person full name as string
 */
export const getVacationRequestPersonFullName = (
  vacationRequest: VacationRequest,
  persons: Person[],
  userProfile?: KeycloakProfile | undefined
) => {
  let personFullName = strings.vacationRequestError.nameNotFound;
  const foundPerson = persons.find((person) => person.keycloakId === vacationRequest?.personId);

  if (foundPerson) {
    personFullName = `${foundPerson.firstName} ${foundPerson.lastName}`;
  } else if (userProfile && userProfile.id === vacationRequest.personId) {
    personFullName = `${userProfile.firstName} ${userProfile.lastName}`;
  }

  return personFullName;
};
