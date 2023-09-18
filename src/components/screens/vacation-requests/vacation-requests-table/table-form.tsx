import { Box, FormControl, Input, InputLabel, MenuItem } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { VacationType } from "../../../../generated/client";

interface VacationFormInput {
  startDate: Date;
  endDate: Date;
  message: string;
  days: number;
  type: { label: string; value: VacationType };
}

const TableForm = () => {
  const { control, handleSubmit } = useForm<VacationFormInput>();

  const onSubmit = (data: VacationFormInput) => {
    alert(JSON.stringify(data));
  };

  const options = (Object.keys(VacationType) as Array<keyof typeof VacationType>).map(
    (vacationType) => {
      return { label: vacationType, value: vacationType };
    }
  );

  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid lightgrey"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputLabel>First Name</InputLabel>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => <Input {...field} />}
          defaultValue=""
        />
        <InputLabel>Vacation Type</InputLabel>
        <Controller
          name="type"
          render={({ field }) => <Select {...field} options={options} />}
          control={control}
          defaultValue={options[0]}
        />
        <input type="submit" />
      </form>
    </Box>
  );
};

export default TableForm;
