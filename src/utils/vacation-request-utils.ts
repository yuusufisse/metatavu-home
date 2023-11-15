import { Person, VacationRequest } from "../generated/client";
import { KeycloakProfile } from "keycloak-js";

/**
 * Get vacation request person full name
 *
 * @param props component properties
 * @returns
 */
export const getVacationRequestPersonFullName = (
  vacationRequest: VacationRequest,
  persons: Person[],
  userProfile: KeycloakProfile | undefined
) => {
  let foundPerson: Person | undefined;
  let personFullName = "";

  if (vacationRequest) {
    foundPerson = persons.find((person) => person.keycloakId === vacationRequest?.personId);
  }

  if (foundPerson) {
    personFullName = `${foundPerson.firstName} ${foundPerson.lastName}`;
  } else {
    vacationRequest?.personId;
  }

  if (personFullName === "" && userProfile && vacationRequest) {
    if (userProfile.id === vacationRequest.personId) {
      personFullName = `${userProfile.firstName} ${userProfile.lastName}`;
    }
  }

  return personFullName;
};
