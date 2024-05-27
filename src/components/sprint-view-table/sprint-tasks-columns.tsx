import type { GridColDef } from "@mui/x-data-grid";
import strings from "../../localization/strings";
import { getHoursAndMinutes } from "../../utils/time-utils";
import type { Tasks, UsersAvatars } from "../../generated/homeLambdasClient";
import { getTotalTimeEntriesTasks } from "src/utils/sprint-utils";
import { Avatar, AvatarGroup } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import { personsAtom } from "src/atoms/person";
import { Person } from "src/generated/client";
import { useAtomValue } from "jotai";
/**
 * Component properties
 */
interface Props {
  tasks: Tasks[];
  timeEntries: number[];
  avatars?: UsersAvatars[];
}

/**
 * Sprint view tasks table columns component
 *
 *  @param props component properties
 */
const sprintViewTasksColumns = ({ tasks, timeEntries, avatars }: Props) => {
  /**
   * Define columns for data grid
   */
  const columns: GridColDef[] = [
    {
      field: "title",
      headerClassName: "header-color",
      headerName: strings.sprint.taskName,
      minWidth: 0,
      flex: 3
    },
    {
      field: "assignedPersons",
      headerClassName: "header-color",
      headerName: strings.sprint.assigned,
      flex: 1,
      renderCell: (params) => {
        const persons: Person[] = useAtomValue(personsAtom);
        return (
          <AvatarGroup 
            sx={{
              '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 15 },
            }}>
              {params.row.assignedPersons.map((personId: number, index: number) => {
                const avatar = avatars && avatars.find(avatar => avatar.personId === personId);
                const person = persons && persons.find(person => person.id === personId);
                const maxAvatarsInLine = 3;
                if (index<maxAvatarsInLine) {
                  return (
                    <Tooltip key={personId} title={person && (`${person.firstName} ${person.lastName}`) || ""}>
                      <Avatar src={avatar && avatar.imageOriginal || ""}/>
                    </Tooltip> 
                  );
                }
                if (index === maxAvatarsInLine && params.row.assignedPersons.length-maxAvatarsInLine > 0) {
                  let tooltipTitile = "";
                  params.row.assignedPersons.slice(maxAvatarsInLine).map((personId: number) => {
                    const personFound = persons.find(person => person.id === personId);
                    tooltipTitile += `${personFound?.firstName} ${personFound?.lastName}, `;
                  })
                  tooltipTitile = tooltipTitile.slice(0, tooltipTitile.length - 2);
                  if (params.row.assignedPersons.length-maxAvatarsInLine === 1) {
                    return (
                      <Tooltip key={personId} title={tooltipTitile}>
                        <Avatar src={avatar?.imageOriginal}/>
                      </Tooltip> 
                    )
                  }
                  return (
                    <Tooltip key={"Group of hidden avatars"} title={tooltipTitile}>
                      <Avatar>+{params.row.assignedPersons.length-maxAvatarsInLine}</Avatar>
                    </Tooltip> 
                  )
                }
              })}
          </AvatarGroup>
        )
      }
    },
    {
      field: "status",
      headerClassName: "header-color",
      headerName: strings.sprint.taskStatus,
      flex: 1,
      valueGetter: (params) => params.row.statusCategory || "",
      renderCell: (params) => params.row.status
    },
    {
      field: "priority",
      headerClassName: "header-color",
      headerName: strings.sprint.taskPriority,
      cellClassName: (params) => (params.row.highPriority ? "high_priority" : "low_priority"),
      flex: 1,
      valueGetter: (params) => (params.row.highPriority ? "High" : "Normal")
    },
    {
      field: "estimate",
      headerClassName: "header-color",
      headerName: strings.sprint.estimatedTime,
      flex: 1,
      valueGetter: (params) => getHoursAndMinutes(params.row.estimate || 0)
    },
    {
      field: "timeEntries",
      headerClassName: "header-color",
      headerName: strings.sprint.timeEntries,
      flex: 1,
      valueGetter: (params) =>
        getHoursAndMinutes(getTotalTimeEntriesTasks(params.row, tasks, timeEntries))
    }
  ];
  return columns;
};

export default sprintViewTasksColumns;