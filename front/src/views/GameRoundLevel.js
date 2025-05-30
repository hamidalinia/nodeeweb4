import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoundDetails, submitAnswerAPI } from "@/functions";
import { Container, Card, CardContent, Button, Box, Grid, Typography, LinearProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import clsx from "clsx";
import { useTranslation } from 'react-i18next';

const RoundLevelPage = () => {
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonStyles, setButtonStyles] = useState({});
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [nextLevelAvailable, setNextLevelAvailable] = useState(false);  // Added state to track next level
  const { gameId, roundId, levelId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRoundDetails = async () => {
      try {
        const response = await getRoundDetails(roundId);
        if (response?.success) {
          setRound(response.round);
          const level = response.round.questions.find(
            (l) => l.levelNumber === parseInt(levelId)
          );
          if (level) {
            setQuestions(level.questions);
            setCurrentLevel(level.levelNumber);
            setCurrentQuestionIndex(0);

            // Check if there is another level after this one
            const nextLevel = response.round.questions.find(
              (l) => l.levelNumber === level.levelNumber + 1
            );
            setNextLevelAvailable(!!nextLevel);
          }
        } else {
          console.log(t("failed_to_load"));
        }
      } catch (error) {
        console.error("Error fetching round details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundDetails();
  }, [roundId, levelId, t]);

  const handleAnswerSubmit = async (questionId, selectedOptionId) => {
    if (isSubmitting || areButtonsDisabled) return;

    setIsSubmitting(true);
    setAreButtonsDisabled(true);

    try {
      const response = await submitAnswerAPI(gameId, roundId, [
        {
          questionId,
          answer: selectedOptionId,
          level: currentLevel,
        },
      ]);

      if (response?.success) {
        const correctAnswerId = response.correctAnswerId;
        const isCorrect = response.correct;

        const updatedStyles = options.reduce((acc, option) => {
          if (option._id === correctAnswerId) {
            acc[option._id] = "correct";
          } else if (option._id === selectedOptionId) {
            acc[option._id] = isCorrect ? "correct" : "incorrect";
          }
          return acc;
        }, {});

        setButtonStyles(updatedStyles);
        console.log(buttonStyles);
        setTimeout(() => {
          setButtonStyles({});
          setAreButtonsDisabled(false);

          if (currentQuestionIndex + 1 === questions.length) {
            setAllQuestionsAnswered(true);  // All questions answered
          } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          }
        }, 2000);
      } else {
        alert(t("failed_to_submit"));
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert(t("failed_to_submit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LinearProgress sx={{ margin: "20px 0" }} />;

  if (!questions || questions.length === 0) {
    return <p>{t("no_question_available")}</p>;
  }

  const currentQuestion = questions[currentQuestionIndex] || {};
  const { question = {}, options = [] } = currentQuestion;
  const questionText = question.fa || t("no_question_available");

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, direction: "rtl" }}>
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2980b9" }} className="prx-heading">
          {t("round")} {round.roundNumber} - {t("level")} {currentLevel}
        </Typography>
        <Typography variant="h6" color="textSecondary" className="prx-subheading">
          {t("question")} {currentQuestionIndex + 1} {t("of")} {questions.length}
        </Typography>
      </Box>

      <Card sx={{ padding: 3, background: "linear-gradient(145deg, #6a11cb, #2575fc)", boxShadow: 3 }} className="prx-card">
        <CardContent>
          <Typography variant="h5" sx={{ color: "#fff", marginBottom: 2 }} className="prx-question-text">
            {questionText}
          </Typography>

          {options.length > 0 ? (
            <Grid container spacing={2} sx={{ marginTop: 2 }} className="prx-options-grid">
              {options.map((option) => {
                const optionText = option?.answer || t("no_options_available");
                const buttonClass =
                  buttonStyles[option._id] === "correct"
                    ? "prx-correct-button"
                    : buttonStyles[option._id] === "incorrect"
                    ? "prx-incorrect-button"
                    : "prx-option-button";
                return (
                  <Grid item xs={12} md={6} key={option._id} className="prx-option-item">
                    <Button
                      variant="contained"
                      fullWidth
                      className={clsx(buttonClass)}
                      onClick={() => handleAnswerSubmit(currentQuestion._id, option._id)}
                      disabled={isSubmitting || areButtonsDisabled}
                      sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        padding: "10px 20px",
                        fontSize: "1rem",
                        textTransform: "none",
                      }}
                    >
                      {optionText}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <p>{t("no_options_available")}</p>
          )}
        </CardContent>
      </Card>

      {/*<Box sx={{ marginTop: 3, display: "flex", justifyContent: "center" }} className="prx-back-button-container">*/}
        {/*<Button*/}
          {/*variant="outlined"*/}
          {/*color="secondary"*/}
          {/*onClick={() => navigate(`/game/${gameId}/round/${roundId}`)}*/}
          {/*sx={{*/}
            {/*marginTop: 3,*/}
            {/*textTransform: "none",*/}
            {/*fontSize: "1rem",*/}
            {/*borderRadius: 2,*/}
            {/*padding: "10px 20px",*/}
          {/*}}*/}
          {/*className="prx-back-button"*/}
        {/*>*/}
          {/*{t("back_to_round")}*/}
        {/*</Button>*/}
      {/*</Box>*/}

      <Dialog open={allQuestionsAnswered} onClose={() => setAllQuestionsAnswered(false)} className={'rtl-dialog'}>
        <DialogTitle>{t("level_completed")}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{t("congratulations_level_completed")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAllQuestionsAnswered(false);
              if (nextLevelAvailable) {
                // If next level exists, navigate to the next level
                navigate(`/game/${gameId}/round/${roundId}/level/${currentLevel + 1}`);
              } else {
                // If no next level, navigate back to the game page
                navigate(`/game/${gameId}`);
              }
            }}
          >
            {nextLevelAvailable ? t("next_level") : t("back_to_game")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoundLevelPage;
