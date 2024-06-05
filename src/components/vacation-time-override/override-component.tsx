import {
  Grow,
  Container,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { useApi } from "src/hooks/use-api";
import type { Person } from "src/generated/client";
import { UpdatePersonRequest } from "src/generated/client";
import { useState } from "react";

/**
 * Component properties
 */
interface Props {
  selectedPerson?: Person;
}
/**
 * All data in the form
 */
interface FormData {
  spentVacations?: number;
  unSpentVacations?: number;
}

/**
 * Component that has the form to override vacationsdays
 *
 * @param props Component properties
 */
const overrideComponent = ({ selectedPerson }: Props) => {
  const { personsApi } = useApi();

  const [formData, setFormData] = useState<FormData>({
    spentVacations: undefined,
    unSpentVacations: undefined
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (selectedPerson) {
      const personToUpdate: UpdatePersonRequest = {
        person: selectedPerson,
        personId: selectedPerson.id
      };

      if (formData.spentVacations) {
        personToUpdate.person.spentVacations = Number(formData.spentVacations);
      }
      if (formData.unSpentVacations) {
        personToUpdate.person.unspentVacations = Number(formData.unSpentVacations);
      }

      try {
        await personsApi.updatePerson(personToUpdate);
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Grow in>
      <Container sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography>Spend vacations: {selectedPerson?.spentVacations}</Typography>

          <TextField
            type="number"
            label="Spent"
            variant="outlined"
            fullWidth
            name="spentVacations"
            value={formData.spentVacations}
            onChange={handleChange}
          />

          <Typography>Unspend vacations: {selectedPerson?.unspentVacations}</Typography>
          <TextField
            type="number"
            label="Unspent"
            variant="outlined"
            fullWidth
            name="unSpentVacations"
            value={formData.unSpentVacations}
            onChange={handleChange}
          />
          <Button sx={{m:2}} type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Container>
    </Grow>
  );
};

export default overrideComponent;
