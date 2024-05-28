import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { useAtomValue } from "jotai";
import { avatarsAtom, personsAtom } from "src/atoms/person";
import type { Person } from "src/generated/client";
import type { UsersAvatars } from "src/generated/homeLambdasClient";

/**
 * Component properties
 */
interface Props {
  assignedPersons: number[];
}

const UserAvatars = ({ assignedPersons }: Props) => {
  const persons: Person[] = useAtomValue(personsAtom);
  const avatars: UsersAvatars[] = useAtomValue(avatarsAtom);
  const maxAvatarsInLine = 3;

  return (
    <AvatarGroup
      sx={{
        "& .MuiAvatar-root": { width: 30, height: 30, fontSize: 15 }
      }}
    >
      {renderAvatars(assignedPersons, persons, avatars, maxAvatarsInLine)}
    </AvatarGroup>
  );
};

/**
 * Render Slack Avatars
 *
 * @param assignedPersons list of all persons 
 * @param avatars list of exsisting avatars 
 * @param persons list of persons assigned to the project
 * @param maxAvatarsInLine avatars limitation per table cell
 */
const renderAvatars = (
  assignedPersons: number[],
  persons: Person[],
  avatars: UsersAvatars[],
  maxAvatarsInLine: number
) => {
  return assignedPersons.map((personId: number, index: number) => {
    const avatar = avatars?.find((avatar) => avatar.personId === personId);
    const person = persons?.find((person) => person.id === personId);
    const numberOfAssignedPersons = assignedPersons.length;

    if (index < maxAvatarsInLine) {
      return (
        <Tooltip key={personId} title={(person && `${person.firstName} ${person.lastName}`) || ""}>
          <Avatar src={avatar?.imageOriginal || ""} />
        </Tooltip>
      );
    }

    if (index === maxAvatarsInLine && numberOfAssignedPersons - maxAvatarsInLine > 0) {
      const groupedPersons = assignedPersons.slice(maxAvatarsInLine);
      let tooltipTitile = "";

      groupedPersons.forEach((groupedPersonId: number) => {
        const personFound = persons.find((person: { id: number }) => person.id === groupedPersonId);
        if (personFound) {
          tooltipTitile += `${personFound?.firstName} ${personFound?.lastName}, `;
        }
      });
      tooltipTitile = tooltipTitile.slice(0, tooltipTitile.length - 2);
      if (numberOfAssignedPersons - maxAvatarsInLine === 1) {
        return (
          <Tooltip key={personId} title={tooltipTitile}>
            <Avatar src={avatar?.imageOriginal} />
          </Tooltip>
        );
      }
      return (
        <Tooltip key={"Group of hidden avatars"} title={tooltipTitile}>
          <Avatar>+{numberOfAssignedPersons - maxAvatarsInLine}</Avatar>
        </Tooltip>
      );
    }
  });
};

export default UserAvatars;
