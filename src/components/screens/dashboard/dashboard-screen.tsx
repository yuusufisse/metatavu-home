import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { PersonTotalTime } from "../../../generated/client";
import { errorAtom } from "../../../atoms/error";
import LoaderWrapper from "../../generics/loader-wrapper";
import {  Box, Container, Grid } from "@mui/material";
import BalanceCard from "./balance-card";
import { Link } from "@mui/material";

/**
 * Dashboard screen component
 */
function DashboardScreen () {
  const auth = useAtomValue(authAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const { personsApi } = useApi();

  interface NavButtonProps {text: string, selected: boolean, sx_props: object} 
  const NavButton = (props: NavButtonProps) => {
    const {text, selected, sx_props} = props;
    return (
      <Link href="#" underline="none" sx={Object.assign({
        "background-color": (selected ? "#dee2e5" : ""),
        "height": "100%",
        "padding": "15px"
      }, sx_props)}>
        {text}
      </Link>
    );
  }
/**
 * Initialize logged in person's time data.
 */
  const getPersons = async () => {
    setIsLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter(person => person.keycloakId === userProfile?.id);

    if (loggedInPerson.length) {
      try {
          const fetchedPerson = await personsApi.listPersonTotalTime({personId: loggedInPerson[0].id});
          setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${ "Person fetch has failed." }, ${ error }`);
      }
    }
    else {
      setError("Your account does not have any time bank entries.");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getPersons();
  }, [auth])
  

  return (
    <LoaderWrapper loading={isLoading}>
      <Container sx={{fontFamily: 'Nunito Sans'}}>
        <Grid container sx={{
                    "border-radius":"15px",
                    "background-color":"#f2f2f2",
                    "box-shadow": "5px 5px 5px 0 rgba(50,50,50,0.1)",
                    p:3
                }}>
          <BalanceCard personTotalTime={personTotalTime} />
        </Grid>
        <br/>
        <Grid container sx={{
                    "border-radius":"15px",
                    "background-color":"#f2f2f2",
                    "box-shadow": "5px 5px 5px 0 rgba(50,50,50,0.1)",
                    p:0
                }}>
          {/* nav start */}
          <Box sx={{
            width:"100%",
            display:"flex",
            justifyContent:"space-between",
            "padding-top": "16px",
            "padding-right": "22px",
            "padding-bottom": "14px",
            "padding-left": "0px"
          }}>
            <Box>
              <NavButton text="Home" selected={true} sx_props={{
                "border-top-left-radius": "15px",
                "border-bottom-left-radius": "15px"
              }}/>
              <NavButton text="Admin" selected={false} sx_props={{}}/>
              <NavButton text="On call" selected={false} sx_props={{}}/>
            </Box>
            <Box>
              <Link href="#" type="button" onClick={() => auth?.logout()} sx={{
                display:"flex",
                justifyContent:"right"
              }}>
                Log out
              </Link>

            </Box>
          </Box>
          
          {/* nav stop */}
        </Grid>
      </Container>
    </LoaderWrapper>
  );
}

export default DashboardScreen;