import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  CardActionArea,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link, useNavigate } from "react-router-dom";
import type { SoftwareRegistry } from "src/generated/homeLambdasClient";
import { useLambdasApi } from "src/hooks/use-api";
import strings from "src/localization/strings";
import AddIcon from "@mui/icons-material/Add";

/**
 * Recommendations component props.
 */
interface RecommendationsProps {
  applications: SoftwareRegistry[];
  setApplications: (apps: SoftwareRegistry[]) => void;
  onAddUser: (appId: string) => Promise<void>;
}

/**
 * Recommendations component.
 *
 * This component renders a list of recommended software for the user, displayed in a carousel format.
 * Each application is displayed as a card, and user can add an application to their list.
 *
 * @component
 * @param RecommendationsProps the propsfor the Recommendations component.
 * @returns The rendered Recommendations component.
 */
const Recommendations: FunctionComponent<RecommendationsProps> = ({
  applications,
  onAddUser,
}) => {
  const swiperRef = React.useRef<any>(null);
  const navigate = useNavigate();
  const { usersApi } = useLambdasApi();
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [loadingUsers, setLoadingUsers] = useState<{ [key: string]: boolean }>({});

  /**
   * Scroll the carousel to the left.
   */
  const handleScrollLeft = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  /**
   * Scroll the carousel to the right.
   */
  const handleScrollRight = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  /**
   * Fetch the user's name by user id.
   *
   * @param {string | undefined} userId - The id of the user whose name should be fetched.
   */
  const fetchUserName = async (userId: string | undefined) => {
    if (!userId || userNames[userId] || loadingUsers[userId]) {
      return;
    }

    setLoadingUsers((prev) => ({ ...prev, [userId]: true }));

    try {
      const users = await usersApi.listUsers();
      const user = users.find((user) => user.id === userId);

      if (user) {
        setUserNames((prev) => ({
          ...prev,
          [userId]: `${user.firstName} ${user.lastName}`,
        }));
      } else {
        console.warn(`User with ID ${userId} not found`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  /**
   * Renders a card for each application in the list.
   *
   * @param {object} props - Props for the ContentCard component.
   * @param {SoftwareRegistry} props.app - The software entry to display in the card.
   * @returns The rendered card component.
   */
  const ContentCard = ({ app }: { app: SoftwareRegistry }) => {
    useEffect(() => {
      if (app.createdBy) {
        fetchUserName(app.createdBy);
      }
    }, [app.createdBy]);

    return (
      <Card
        sx={{
          width: 247,
          height: 250,
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          margin: "10px",
          ":hover": {
            boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.3)",
          },
          position: "relative",
        }}
      >
        <CardActionArea
          component={Link}
          to={`${app.id}`}
          sx={{ padding: "16px" }}
        >
          <CardMedia
            component="img"
            height="80"
            image={app.image}
            alt={app.name}
            sx={{
              objectFit: 'contain',
              marginBottom: '16px',
              borderRadius: "8px",
            }}
          />
          <CardContent sx={{ padding: "0px", flex: "1" }}>
            <Typography
              gutterBottom
              variant="h6"
              mt={1}
              sx={{ fontSize: "16px", fontWeight: "bold" }}
            >
              {app.name}
            </Typography>
            <Box>
              <Typography
                mt={1}
                sx={{
                  fontSize: "14px",
                  color: "#f9473b",
                  fontWeight: "bold",
                }}
              >
                {loadingUsers[app.createdBy]
                  ? "Loading..."
                  : userNames[app.createdBy] || "Unknown User"}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              sx={{
                height: '60px',
                gap: 0.5,
                marginTop: '8px',
              }}
            >
              {app.tags &&
                app.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{
                      height: '25px',
                      borderRadius: '5px',
                      padding: '0px',
                      margin: '2px',
                      backgroundColor: '#ff4d4f',
                      color: '#fff',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  />
                ))}
            </Box>
          </CardContent>
        </CardActionArea>

        <IconButton
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "#000",
          }}
          onClick={() => {
            if (app.id) {
              setLoadingAppId(app.id);
              onAddUser(app.id).finally(() => setLoadingAppId(null));
            }
          }}
        >
          {loadingAppId === app.id ? <CircularProgress size={24} /> : <AddIcon />}
        </IconButton>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: { xs: "26px", sm: "40px 50px" },
        boxSizing: "border-box",
        gap: { xs: "15px", sm: "30px" },
        textAlign: "left",
        fontSize: { xs: "18px", sm: "30px" },
        color: "#000",
        fontFamily: "Poppins",
        marginBottom: "30px",
      }}
    >
      <Typography variant="h5" sx={{ alignSelf: "flex-start", fontWeight: "bold", mb: 2 }}>
        {strings.softwareRegistry.recommendations}
      </Typography>

      {applications.length > 0 ? (
        <Grid container sx={{ position: "relative", alignItems: "center" }}>
          <IconButton
            onClick={handleScrollLeft}
            sx={{
              backgroundColor: "#f9473b",
              marginLeft: "4px",
              color: "#fff",
              position: "absolute",
              left: "-50px",
              zIndex: 1,
              top: "50%",
              transform: "translateY(-50%)",
              "&:hover": {
                backgroundColor: "#d63b31",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Swiper ref={swiperRef} spaceBetween={10} slidesPerView="auto">
            {applications.map((app) => (
              <SwiperSlide key={app.id} style={{ width: "260px" }}>
                <ContentCard app={app} />
              </SwiperSlide>
            ))}
          </Swiper>

          <IconButton
            onClick={handleScrollRight}
            sx={{
              backgroundColor: "#f9473b",
              marginRight: "4px",
              color: "#fff",
              position: "absolute",
              right: "-50px",
              zIndex: 1,
              top: "50%",
              transform: "translateY(-50%)",
              "&:hover": {
                backgroundColor: "#d63b31",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Grid>
      ) : (
        <Typography variant="h6" sx={{ color: "#000", mt: 3 }}>
          {strings.softwareRegistry.noRecommendations}
        </Typography>
      )}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/softwareregistry/allsoftware")}
          sx={{
            textTransform: "none",
            color: "#fff",
            fontSize: "18px",
            background: "#f9473b",
            borderRadius: "25px",
            "&:hover": { background: "#000" },
          }}
        >
          {strings.softwareRegistry.allApplications}
        </Button>
      </Box>
    </Box>
  );
};

export default Recommendations;
