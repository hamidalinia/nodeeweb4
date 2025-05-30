import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, CardBody, CardTitle, Progress } from 'shards-react';
import { getMyCourses,MainUrl,setStyles } from '@/functions';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CircularProgress from '@mui/material/CircularProgress';

const MyCourses = (props) => {
  let {  t,element = {}} = props;
  let { settings = {} } = element;
  let { general = {} } = settings;
  let { fields = {} } = general;
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [loading, setLoading] = useState(true); // Loading state
  // const [error, setError] = useState(null); // Error state

  // Extract button-related fields
  const {
    classes = '',
    showInMobile = false,
    text = t('Back'),
  } = fields;
  const style = setStyles(fields);

  // Fetch user's courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getMyCourses(); // Fetch courses
        if (response.success) {
          setCourses(response.data); // Store in state
        }
        // else {
        //   setError(t('Error fetching courses'));
        // }
      } catch (err) {
        console.error('Error fetching courses:', err);
        // setError(t('Error fetching courses'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const goBack = () => navigate(-1); // Navigate back

  // Calculate the progress of the course based on seasons and lessons
  const calculateProgress = (course) => {
    console.log("calculateProgress",course)
    if (!course.course || !course.course.season) {
      return 0; // Return 0 progress if the necessary properties don't exist
    }

    let totalLessons = 0;
    let completedLessons = 0;

    // Correctly access the 'season' property within the 'course' object
    course.course.season.forEach((season) => {
      totalLessons += season.lessons.length;
      completedLessons += season.lessons.filter((lesson) => lesson.score !== "").length;
    });

    if (totalLessons === 0) return 0; // Avoid division by zero
    return (completedLessons / totalLessons) * 100;
  };


// return JSON.stringify(fields)
  return (
    <div className="my-courses-container" style={style}>

      {/* Loading State */}
      {loading && <div className={'loading-my-course'}><CircularProgress thickness={2}
                                            size={40}/></div>}

      {/* Error State */}
      {/*{!loading && error && <p className="text-danger">{error}</p>}*/}

      {/* Courses List */}
      {!loading && courses?.length > 0 ? (
        <>
          {courses.map((courseData) => {
            const course = courseData.course; // Access the course object

            return (
              <div key={course._id} className={'my-course-item'}>

                <div className={'my-course-item-box'}>
                   <div className={'my-course-item-box-image'}>
                    {/* Course Icon */}
                    {course.icon && (
                      <img
                        src={MainUrl + '/' + course.icon[0]} // Assuming only one icon per course
                        alt="Course Icon"
                        width="100%"
                        height="auto"
                      />
                    )}
                  </div>
                  <div className={'my-course-item-box-title'}>
                    {/* Course Title */}
                    <div className={'my-course-item-box-header'}>{course.title.fa}</div>
                    <div>{course.courseLength}</div>

                    {/* Progress Bar */}

                  </div>
                </div>
                <div className={'my-course-item-box-footer'}>
                <div className={'my-course-progress-wrapper'}>
                  <Progress
                    value={calculateProgress(course)} // Course progress
                    color="success"
                    className="mb-2"
                  >
                  </Progress>
                  <div className={'percent-box'}>                    {Math.round(calculateProgress(course))}%
</div>
                </div>

                  {/* Continue Course Link */}
                  <Link className={'btn btn-primary'} to={`/course/${course._id}`}><span>{t('Continue Course')}</span><ArrowBackIosNewIcon/>
                  </Link>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        !loading && <p className={'error-my-course'}>{t('You have not participated in any courses yet.')}</p>
      )}
    </div>
  );
};

export default withTranslation()(MyCourses);
