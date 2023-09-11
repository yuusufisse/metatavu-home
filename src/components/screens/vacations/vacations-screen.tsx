import { Button, Container } from "@mui/material";
import LoaderWrapper from "../../generics/loader-wrapper";
import VacationsTable from "./vacations-table";
import fetchVacationRequests from "./vacations-fetch";
import { useEffect, useState } from "react";
import { vacationsAtom } from "../../../atoms/vacations";
import { useSetAtom } from "jotai";

const Vacations = () => {
  const setVacations = useSetAtom(vacationsAtom);
  const { vacations, isLoading } = fetchVacationRequests();

  useEffect(() => {
    setVacations(vacations);
    console.log(vacations)
  },[vacations])

  return (
    <Container>
      <LoaderWrapper loading={isLoading}>
        <VacationsTable />
      </LoaderWrapper>
    </Container>
  );
}

export default Vacations;