import { Box, Link } from "@mui/material";
import { Auth } from "../../atoms/auth";

interface HomeNavProps { auth: Auth | undefined}

const HomeNav = (props: HomeNavProps) => {
    const { auth } = props;

    interface NavButtonProps {
        text: string, 
        selected: boolean, 
        sx_props: object
    } 
    const NavButton = (props: NavButtonProps) => {
      const {text, selected, sx_props} = props;
      return (
        <Link href="#" underline="none" sx={Object.assign({
          "background-color": (selected ? "#dee2e5" : ""),
          "height": "100%",
          "padding": "15px"
        }, sx_props)}>
          { text }
        </Link>
      );
    }

    return (
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
    );
}

export default HomeNav;