import { MenuItem, Card, Grow, FormControl, InputLabel, Select } from "@mui/material";
import strings from "src/localization/strings";
import { useAtomValue } from "jotai";
import { personsAtom } from "src/atoms/person";
import UserRoleUtils from "src/utils/user-role-utils";
import OverrideComponent from "./override-component";
import type { Person } from "src/generated/client";

/**
 * Component properties
 */
interface Props {
  selectedPerson: Person | undefined;
  selectedEmployeeId: number | undefined;
  setSelectedEmployeeId: (selectedEmployeeId?: number) => void;
}

/**
 * Component that contains the entirety of Override content
 *
 * @param props Component properties
 */
const VacationTimeOverrideContent = ({
  selectedPerson,
  selectedEmployeeId,
  setSelectedEmployeeId
}: Props) => {
  const persons = useAtomValue(personsAtom);
  const isAdmin = UserRoleUtils.isAdmin();

  return (
    <>
      {isAdmin && (
        <Grow in>
          <Card sx={{ p: "1%", display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <FormControl fullWidth>
              <InputLabel id="employee-select-label">{strings.employeeSelect.employeeSelectlabel}</InputLabel>
              <Select
                labelId="employee-select-label"
                id="employee-select"
                value={selectedEmployeeId}
                onChange={(event) => setSelectedEmployeeId(Number(event.target.value))}
                label={strings.employeeSelect.employeeSelectlabel}
              >
                {persons.map((person) => (
                  <MenuItem key={person.id} value={person.id}>
                    {`${person.firstName} ${person.lastName}`}
                  </MenuItem>
                ))}

                
              </Select>
            </FormControl>
          </Card>
        </Grow>
      )}
      <OverrideComponent selectedPerson={selectedPerson}/>
    </>
  );
};

export default VacationTimeOverrideContent;