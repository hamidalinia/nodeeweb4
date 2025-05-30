import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getRoundDetails} from "@/functions";
import {Box, Button, Card, CardContent, Container, Grid, Typography} from "@mui/material";
import {CheckCircle, PauseCircle, PlayArrow} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import store from '#c/functions/store';
import {Col, Row} from 'shards-react';
import {MainUrl} from '#c/functions/index';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const RoundPage = () => {
  const {t} = useTranslation();

  let st = store.getState().store.user;
  let userDetails = {}
  if (st.firstName && st.lastName) {
    userDetails.name = st.firstName + ' ' + st.lastName;
  }

  const [shouldWeSearch, setShouldWeSearch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(null);
  const [game, setGame] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [participants, setParticipants] = useState(null);
  const {gameId, roundId} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fetchRoundDetails = async () => {
    try {
      const response = await getRoundDetails(roundId);
      // console.log("response is:",response);

      if (response?.success) {
        setRound(response.round);
        setShouldWeSearch(response.shouldWeSearch);
        setGame(response.game);
        setParticipant(response.participant);
        setParticipants(response.participants);
      } else {
        console.log("Failed to load round details.", response);
        setShouldWeSearch(true);

        if (response?.message == 'Game round is completed!') {

        }
      }
    } catch (error) {
      console.error("Error fetching round details:", error);
    } finally {
      setLoading(false);
      console.log("Finally load response.");

    }
  };

  useEffect(() => {
    if (shouldWeSearch) {
      const interval = setInterval(() => {
        fetchRoundDetails(); // Re-fetch round details
      }, 10000); // 10000 ms = 10 seconds

      // Clean up the interval when shouldWeSearch is false or component unmounts
      return () => clearInterval(interval);
    }
  }, [shouldWeSearch, roundId]);
  useEffect(() => {
    fetchRoundDetails();
  }, [roundId]);

  const levels = game?.levels || [];
  const participantLevels = participant?.levels || [];

  const getLevelStatus = (levelNumber) => {
    const participantLevel = participantLevels.find(
      (l) => l.levelNumber === levelNumber
    );
    if (participantLevel) {
      const answeredQuestions = participantLevel.answers.length;
      const totalQuestions = levels.find(
        (lvl) => lvl.levelNumber === levelNumber
      )?.numberOfQuestions;

      if (answeredQuestions === totalQuestions) {
        return t('completed');
      }
      return t('inProgress');
    }
    return t('notStarted');
  };
  const goBack = () => {
    navigate(-1);
  };
  // return ('hi')
  if (shouldWeSearch)
    return (<Container fluid className="main-content-container px-4 maxWidth1200 height100vh game-searching-opponent"
                       style={{paddingTop: '0px'}}>
      <Row style={{
        flexDirection: "column"
      }}>
        <Col style={{textAlign: 'center'}} className={'col-search-opponent'}>


          <div className="mb-3 mx-auto">
            {!(st.photos && st.photos[0]) && <AccountCircleIcon className={'humanprofile social white'}/>}
            {(st.photos && st.photos[0] && st.photos[0].url) &&
            <img className={'humanprofile social white'} src={MainUrl + '/' + st.photos[0].url}/>}
            <div style={{marginTop: '20px', fontWeight: 'bold', color: '#fff'}}>{userDetails.name}</div>
          </div>
          <div className="mb-3 mx-auto font-bold">
            در حال پیدا کردن حریف...
          </div>
          <div className="mb-3 mx-auto">
            <Button className="button-search-opponent">
              لغو و بازگشت
            </Button>
          </div>
        </Col></Row></Container>);
  if (loading) return <Typography variant="h6" align="center">{t('loading')}</Typography>;
  if (!round) return <Typography variant="h6" align="center">{t('roundDetailsNotFound')}</Typography>;

  return (
    <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>

      <div className=" game-post-single-wrapper-top-bar">
        <Button
          className="top-bar-back-button"
          onClick={goBack}>
          <ArrowForwardIosIcon/>
          <span>

        </span>
        </Button>
      </div>
      <div className={'game-participants'}>
        {participants && participants?.map((par) => {
          let customer = par.customer
          let par_levels = par.levels
          return <div className={'part-col'}>
            <div className="mb-3 mx-auto participant-info">
              {!(customer.photos) && <AccountCircleIcon className={'humanprofile social white'}/>}
              {(customer.photos && customer.photos.url) &&
              <img className={'humanprofile social white'} src={MainUrl + '/' + customer.photos.url}/>}
              <div style={{
                marginTop: '20px',
                fontWeight: 'bold',
                color: '#fff'
              }}>{customer.firstName + ' ' + customer.lastName}</div>
            </div>
            <div className={'part-col-levels'}>
              {par_levels && par_levels.map((parl) => {
                let parl_ans = parl.answers
                return <div className={'part-col-level'}>{parl_ans && parl_ans.map((parls) => {
                  return parls.isCorrect ? <CheckCircleIcon className={"answer-is-correct"}/> : <CancelIcon className={"answer-is-wrong"}/>;

                })}</div>
              })}
            </div>
          </div>
        })}
      </div>
      <Container className={'game-roound-all-levels'} fluid sx={{padding: 4, backgroundColor: '#ecf0f1', direction: 'rtl', flexGrow: 1}}>
        {levels.length > 0 ? (
          <Grid container spacing={3}>
            {levels.map((level) => {
              const status = getLevelStatus(level.levelNumber);
              const isCompleted = status === t('completed');

              return (
                <Grid item xs={12} md={6} lg={4} key={level._id}>
                  {/*card*/}
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: 3,
                      background: isCompleted
                        ? "linear-gradient(145deg, #2ecc71, #27ae60)"
                        : "linear-gradient(145deg, #f39c12, #f1c40f)",
                      boxShadow: 5,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" gutterBottom sx={{color: "#34495e"}}>
                        {t('level')} {level.levelNumber}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        <strong>{t('difficulty')}:</strong> {t(level.difficulty.toLowerCase())}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        <strong>{t('questions')}:</strong> {level.numberOfQuestions}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        <strong>{t('status')}:</strong>{" "}
                        <span className={isCompleted ? "text-white" : "text-dark"}>
                          {status}
                        </span>
                      </Typography>
                    </CardContent>

                    {!isCompleted && (
                      <Box sx={{display: "flex", justifyContent: "flex-end", width: "100%", mt: 2}}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{display: "flex", alignItems: "center"}}
                          onClick={() =>
                            navigate(`/game/${gameId}/round/${roundId}/level/${level.levelNumber}`)
                          }
                        >
                          {status === t('inProgress') ? (
                            <>
                              <PauseCircle sx={{mr: 1}}/>
                              {t('resume')}
                            </>
                          ) : (
                            <>
                              <PlayArrow sx={{mr: 1}}/>
                              {t('start')}
                            </>
                          )}
                        </Button>
                      </Box>
                    )}

                    {isCompleted && (
                      <Box sx={{display: "flex", justifyContent: "center", width: "100%", mt: 2}}>
                        <CheckCircle sx={{fontSize: 40, color: "white"}}/>
                      </Box>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">{t('noLevelsAvailable')}</Typography>
        )}
      </Container>
    </Box>
  );
};

export default RoundPage;
