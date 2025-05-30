import React, {useEffect, useState,useCallback} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {  Button } from 'shards-react';
import { Modal,Box } from '@mui/material';

import {withTranslation} from 'react-i18next';
import Loading from '#c/components/Loading';
import {getMyCourse,MainUrl} from '#c/functions/index';
import {useSelector} from 'react-redux';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleIcon from '@mui/icons-material/Article';
import {useLocation, useNavigate} from 'react-router-dom';

const CourseStudy = (props) => {
  const {t} = props;
  const {_id: courseId} = useParams();
  const token = useSelector((st) => st.store.user.token);
  const [courseSeason, setCourseSeason] = useState([]);
  const [myCourse, setMyCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = useCallback(() => {
    const {history, location} = window;

    if (history.length <= 2 && location.pathname !== '/') navigate('/');
    else if (location.pathname === '/profile') navigate('/');
    else if (history.length > 2) navigate(-1);
  }, [navigate]);
  const handleClose = () => setOpenModal(false);
  const getDeterministicRandom = (input1, input2) => {
    // Special case for (0, 0)
    if (input1 === 0 && input2 === 0) {
      return 50; // Return a fixed value for (0, 0), or adjust to your desired number
    }

    // Combine inputs into a single string
    const combinedInput = `${input1}-${input2}`;

    // Create a hash-like approach by summing the characters' char codes
    let hash = 0;
    for (let i = 0; i < combinedInput.length; i++) {
      hash = (hash << 5) - hash + combinedInput.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }

    // Map the result to a number between 0 and 100
    const result = Math.abs(hash % 101); // Ensure the result is between 0 and 100

    return result;
  };


  useEffect(() => {
    getMyCourse(courseId)
      .then((d) => {
        setMyCourse(d.myCourse);
        setCourseSeason(d.courseSeason);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching course:', err);
        setLoading(false);
      });
  }, [courseId]);

  if (!token) {
    return <Navigate to="/login" replace={true}/>;
  }

  if (loading) {
    return <Loading/>;
  }

  return (
    <div className="main-content-container p-0 pb-4 bg-dark-abi">

      <div className={'course-top-bar-menu'}>
        <Button onClick={(e)=>handleBack(e)}>
          <ArrowForwardIcon/>
        </Button>
        <div className={'seasons-course-title'}>{myCourse?.course?.title?.fa}</div>
        <Button  onClick={(e)=>handleBack(e)}>
          <ArticleIcon/>
        </Button>
        </div>

      {/* Course Seasons Section */}
      <div className="course-seasons">
        {courseSeason && courseSeason.length > 0 ? (
          courseSeason.map((season, index) => (
            <div key={index} className="season-card">
              <div className={'season-head-wrapper'}>
                <div className={'season-title-wrapper'}>
                  <div className={'season-title-icon'}>
                    <HistoryEduIcon/>
                  </div>
                  <div className={'season-title-inside-wrapper'}>
                    <div className={'season-section'}>
                      {t('section')} {(index + 1)}
                    </div>
                    <div className={'season-title'}>{season.seasonTitle}</div>
                  </div>
                </div>
                <div className={'season-score'}>
                  <ElectricBoltIcon/>
                </div>
              </div>

              {/* Lessons within each Season */}
              {season.lessons && season.lessons.length > 0 ? (
                <div className={'lesson-wrapper'}>
                  {season.lessons.map((lesson, idx) => {
                    let lef=getDeterministicRandom(index,idx)
                    return(

                      <div className="lesson-card">
                        {/*to={`/course/study/lesson/${lesson.lessonRef}`}*/}
                        <Button onClick={(e)=>{
                          setModalData(prevState => ({
                            ...prevState,
                            title: lesson?.title?.fa,
                            _id: lesson?.lessonRef
                          }));
                          setOpenModal(true)}} style={{left:lef+'%'}}  className="course-chapter-disabled">
                          {(myCourse?.course?.icon && myCourse?.course?.icon[0]) && <img src={MainUrl+'/'+(myCourse?.course?.icon[0])}></img>}
                        </Button>
                        <div className={'lesson-connector conn-'+lef}></div>


                      </div>

                    )
                  })}
                </div>
              ) : (
                <p>{t('No lessons available for this season')}</p>
              )}
            </div>
          ))
        ) : (
          <p>{t('No seasons available for this course')}</p>
        )}
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          className={'course-lesson-modal'}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
          }}
        >
          <div>

          </div>
          <div>
          <h6 className="course-modal-title">
            {modalData.title}
          </h6>
          </div>
          <Link className={'btn btn-primary course-start-lesson-b'} to={'/course/study/lesson/'+modalData?._id}>{t("start")}</Link>
        </Box>
      </Modal>
    </div>
  );
};

export default withTranslation()(CourseStudy);
