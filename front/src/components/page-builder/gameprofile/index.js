import React, {useState,useEffect} from 'react';
import {withTranslation} from 'react-i18next';
import { Col, Container, Row} from 'shards-react';
import { Button, Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";

// import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import {MainUrl} from '#c/functions/index';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HelpIcon from '@mui/icons-material/Help';
import store from '#c/functions/store';
import {Link, Navigate, useNavigate} from "react-router-dom";
import { fetchGameDetails, getAllRounds, joinGameRound } from "@/functions";
import {useParams} from "react-router-dom/dist/index";

const Thegameprofile = (props) => {
  const { t, i18n } = props;

  let st = store.getState().store.user;
  let userDetails = {}
  if (st.firstName && st.lastName) {
    userDetails.name = st.firstName + ' ' + st.lastName;
  }
  let { element = {}, content } = props;
  let { data = {}, settings = {}, children } = element;
  let { general = {} } = settings;
  let { fields = {} } = general;
  const { game: gameId } = fields;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pendingRound, setPendingRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // return JSON.stringify(fields)

  // console.log("fields", fields)


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
  const handleRoundClick = (roundId) => {
    navigate(`/game/${gameId}/round/${roundId}`);
  };
  return (
    <Container fluid className="main-content-container px-4 maxWidth1200 height100vh" style={{paddingTop: '0px'}}>
      <Row style={{
        flexDirection: "column"
      }}>
        <Col style={{textAlign: 'center'}}>

          <div className="mb-3 mx-auto">
            {!(st.photos && st.photos[0]) && <AccountCircleIcon className={'humanprofile social white'}/>}
            {(st.photos && st.photos[0] && st.photos[0].url) && <img className={'humanprofile social white'} src={MainUrl+'/'+st.photos[0].url}/>}
            <div style={{marginTop:'20px',fontWeight:'bold',color:'#fff'}}>{userDetails.name}</div>
          </div>

        </Col>
        <Col>
          <Row className={'justify-content-center'}>
            <Col className={'game-icon-wrapper justify-content-left'}>
              <Button className={'game-icon'}>
                <BarChartIcon/>
                <div>آمار</div>
              </Button>
            </Col>
            <Col className={'game-icon-wrapper game-icon-wrapper-line'}>
              <Button className={'game-icon'}>
                <WorkspacePremiumIcon/>
                <div>لیگ</div>
              </Button>
            </Col>
            <Col className={'game-icon-wrapper justify-content-right'}>
              <Button className={'game-icon'}>
                <HelpIcon/>
                <div>راهنما</div>
              </Button>
            </Col>
          </Row>
        </Col>


        <Col style={{margin: "30px 0 0"}}>
          <Row>

            <Col className={'game-icon-wrapper-buttons'}>
              <Link to={'/game/'+gameId} className={'game-icon-button-low'} onClick={(e)=>{console.log('e',e)}}>
                <div>بازی با حریف تصادفی</div>
              </Link>
            </Col>
            <Col className={'game-icon-wrapper-buttons'}>
              <Button className={'game-icon-button-low game-icon-button-dark'}>بازی با دوستان
                <span>(بزودی)</span>
              </Button>

            </Col>
          </Row>
        </Col>
        {rounds?.length > 0 && <Col style={{margin: "30px 0 0"}} className={'game-participant-wrapper'}>



              {rounds.length > 0 ? (
                rounds.map((round) => (
                  <div className={'game-participants'}>
                    {round.participants && round.participants?.map((par) => {
                      let customer = par.customer
                      let par_levels = par.levels
                      return <div className={'part-col'}>
                        <div className="mb-3 mx-auto participant-info">
                          {!(customer?.photos?.url) && <AccountCircleIcon className={'humanprofile social white'}/>}
                          {(customer.photos && customer.photos.url) &&
                          <img className={'humanprofile social white'} src={MainUrl + '/' + customer.photos.url}/>}
                          <div style={{
                            marginTop: '20px',
                            fontWeight: 'bold',
                            color: '#fff'
                          }}>{customer.firstName + ' ' + customer.lastName}</div>
                        </div>

                      </div>
                    })}

                  </div>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: "#7f8c8d" }}>
                  {t("No rounds available.")}
                </Typography>
              )}


        </Col>}
      </Row>
    </Container>
  );
};

export default withTranslation()(Thegameprofile);
