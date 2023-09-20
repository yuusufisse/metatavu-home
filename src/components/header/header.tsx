import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { PersonTotalTime } from "../../generated/client";
import { errorAtom } from "../../atoms/error";
import LoaderWrapper from "../generics/loader-wrapper";
import { Box, Container, Grid } from "@mui/material";
import BalanceCard from "./balance-card";
import HomeNav from "./nav";
import LocalizationButtons from "../layout-components/localization-buttons";

/**
 * Header component
 */
const Header = () => {
  const auth = useAtomValue(authAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const { personsApi } = useApi();

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    setIsLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter((person) => person.keycloakId === userProfile?.id);

    if (loggedInPerson.length) {
      try {
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: loggedInPerson[0].id
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${"Person fetch has failed."}, ${error}`);
      }
    } else {
      setError("Your account does not have any time bank entries.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPersons();
  }, [auth]);

  return (
    <LoaderWrapper loading={isLoading}>
      <Container sx={{ fontFamily: "Nunito Sans" }}>
        <Grid
          container
          sx={{
            "borderRadius": "15px",
            "backgroundColor": "#f2f2f2",
            "boxShadow": "5px 5px 5px 0 rgba(50,50,50,0.1)",
            p: 3
          }}
        >
          <Grid item xs={6} md={10}>
            <BalanceCard personTotalTime={personTotalTime} />
          </Grid>
          <Grid item xs={6} md={2}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <LocalizationButtons />
            </Box>
          </Grid>
        </Grid>
        <br />
        <Grid
          container
          sx={{
            "borderRadius": "15px",
            "backgroundColor": "#f2f2f2",
            "boxShadow": "5px 5px 5px 0 rgba(50,50,50,0.1)",
            p: 0
          }}
        >
          <HomeNav auth={auth} />
        </Grid>
      </Container>
    </LoaderWrapper>
  );
};

export default Header;
