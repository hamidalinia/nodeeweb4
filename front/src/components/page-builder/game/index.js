import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetchGameDetails, getAllRounds, joinGameRound} from "@/functions";
import {useTranslation} from 'react-i18next';
import {Box, Button, CircularProgress, Grid, Paper, Typography} from "@mui/material";

const TheGame = () => {
  const {t, i18n} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pendingRound, setPendingRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const {_id: gameId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameDetails, roundsDetails] = await Promise.all([
          fetchGameDetails(gameId),
          getAllRounds(gameId),
        ]);

        if (gameDetails?.success) {
          setGame(gameDetails.game);
          setCategories(gameDetails.categories);
          setRounds(roundsDetails?.rounds || []);
          const openRound = roundsDetails.rounds.find(
            (round) => round.status === "open" || round.status === "pending"
          );
          setPendingRound(openRound);
        } else {
          setErrorMessage(t("Game not found"));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage(t("Error fetching game details"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId, navigate, t]);

  const handleCategorySelection = async (categoryId) => {
    try {
      const response = await joinGameRound(gameId, {selectedCategory: categoryId});

      if (response?.success && response.gameRound) {
        const gameRoundId = response.gameRound._id;
        navigate(`/game/${gameId}/round/${gameRoundId}`);
      } else {
        alert(response?.message || t("Failed to join or start the game"));
      }
    } catch (error) {
      console.error("Error joining or starting game:", error);
      alert(t("An error occurred while trying to start the game."));
    }
  };

  const handleRoundClick = (roundId) => {
    navigate(`/game/${gameId}/round/${roundId}`);
  };

  const handleStartRound = () => {
    if (pendingRound) {
      navigate(`/game/${gameId}/round/${pendingRound.roundId}`);
    }
  };
  if (pendingRound) {
    handleStartRound()
    return
  }
  return (
    <Box sx={{
      padding: 4,
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
      direction: i18n.language === "fa" ? "rtl" : "ltr"
    }}>
      {loading ? (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
          <CircularProgress/>
        </Box>
      ) : (
        <Box sx={{textAlign: "center"}}>
          {errorMessage ? (
            <Paper sx={{padding: 3, backgroundColor: "#e74c3c", color: "#fff", borderRadius: 2, marginBottom: 3}}>
              <Typography variant="h6">{errorMessage}</Typography>
            </Paper>
          ) : (
            <>
              <Typography variant="h3" sx={{color: "#34495e", marginBottom: 2}}>
                {game?.title}
              </Typography>
              <Typography variant="body1" sx={{color: "#7f8c8d", marginBottom: 4}}>
                {game?.description}
              </Typography>

              {pendingRound ? (
                <Box sx={{backgroundColor: "#f1c40f", padding: 3, borderRadius: 2, marginBottom: 4}}>
                  <Typography variant="h5" sx={{color: "#fff"}}>
                    {t("Pending Round")}
                  </Typography>
                  <Typography variant="body1" sx={{color: "#fff"}}>
                    {t("You have a pending round. Please complete it before starting a new one.")}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{backgroundColor: "#2ecc71", marginTop: 2}}
                    onClick={handleStartRound}
                  >
                    {t("Continue Round")}
                  </Button>
                </Box>
              ) : (
                <Box sx={{marginBottom: 4}}>
                  <Typography variant="h5" sx={{color: "#34495e", marginBottom: 2}}>
                    {t("Select Category")}
                  </Typography>
                  <Grid container spacing={2} justifyContent="center">
                    {categories.map((category) => (
                      <Grid item key={category._id}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#3498db",
                            padding: "10px 20px",
                            borderRadius: 3,
                            boxShadow: 3,
                            "&:hover": {backgroundColor: "#2980b9"},
                          }}
                          onClick={() => handleCategorySelection(category._id)}
                        >
                          {category.name?.fa}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/*<Box>*/}
              {/*<Typography variant="h5" sx={{ color: "#34495e", marginBottom: 2 }}>*/}
              {/*{t("Available Rounds")}*/}
              {/*</Typography>*/}
              {/*<Box*/}
              {/*sx={{*/}
              {/*display: "grid",*/}
              {/*gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",*/}
              {/*gap: 2,*/}
              {/*}}*/}
              {/*>*/}
              {/*{rounds.length > 0 ? (*/}
              {/*rounds.map((round) => (*/}
              {/*<Paper*/}
              {/*key={round.roundId}*/}
              {/*sx={{*/}
              {/*padding: 3,*/}
              {/*backgroundColor: "#ecf0f1",*/}
              {/*borderRadius: 2,*/}
              {/*boxShadow: 2,*/}
              {/*"&:hover": { backgroundColor: "#d5dbdb", cursor: "pointer" },*/}
              {/*}}*/}
              {/*onClick={() => handleRoundClick(round.roundId)}*/}
              {/*>*/}
              {/*<Typography variant="h6" sx={{ color: "#34495e" }}>*/}
              {/*{t("Round")} {round.roundNumber}*/}
              {/*</Typography>*/}
              {/*<Typography variant="body1" sx={{ color: "#7f8c8d" }}>*/}
              {/*{t("Status")}: {round.status}*/}
              {/*</Typography>*/}
              {/*</Paper>*/}
              {/*))*/}
              {/*) : (*/}
              {/*<Typography variant="body1" sx={{ color: "#7f8c8d" }}>*/}
              {/*{t("No rounds available.")}*/}
              {/*</Typography>*/}
              {/*)}*/}
              {/*</Box>*/}
              {/*</Box>*/}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TheGame;
