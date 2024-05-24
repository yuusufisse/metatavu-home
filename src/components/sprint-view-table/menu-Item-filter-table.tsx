import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import strings from 'src/localization/strings';
import { Status } from '../constants';

  interface Filter {
    key: number;
    value: string;
    label: string;
  }
  
  export const TaskStatusFilter = (setFilter: (string: string) => void) => {
  
    const statusFilters : Filter[] = [
      { key: 1, value: Status.TODO, label: strings.sprint.toDo },
      { key: 2, value: Status.INPROGRESS, label: strings.sprint.inProgress },
      { key: 3, value: Status.DONE, label: strings.sprint.completed },
      { key: 4, value: Status.ALL, label: strings.sprint.allTasks }
    ];

    return (
      <FormControl size="small" style={{ width: "200px", float: "right" }}>
      <InputLabel disableAnimation={false}>{strings.sprint.taskStatus}</InputLabel>
      <Select
        defaultValue={strings.sprint.allTasks}
        style={{
          borderRadius: "30px",
          marginBottom: "15px",
          float: "right"
        }}
        label={strings.sprint.taskStatus}
      >
        { statusFilters.map(filter => (
          <MenuItem 
            key={filter.key} 
            value={filter.label} 
            onClick={() => setFilter(filter.value)}
          >
            {filter.label}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
    )  
  }