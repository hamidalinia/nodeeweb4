import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'shards-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Loading from '#c/components/Loading';
import { getLesson } from '#c/functions/index';
import { useSelector } from 'react-redux';

const CourseStudyLesson = (props) => {
  const { t } = props;
  const { _id: lessonId } = useParams(); // Use the lesson ID from the URL params
  const token = useSelector((state) => state.store.user.token); // Get token from Redux state
  const [lessonData, setLessonData] = useState(null); // State to store lesson data
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0); // Index to track current lesson
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch lesson data based on lesson ID
  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const data = await getLesson(lessonId); // Fetch lesson data
        setLessonData(data); // Store the fetched data
      } catch (error) {
        console.error('Error fetching lesson data:', error); // Error handling
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurs
      }
    };

    fetchLessonData();
  }, [lessonId]); // Re-fetch data when lessonId changes

  // If there's no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Show loading screen until lesson data is fetched
  if (loading) {
    return <Loading />;
  }

  // Destructure lesson data
  const { title, secondTitle, lessons } = lessonData;

  // Function to handle clicking the "Continue" button
  const handleContinue = () => {
    // Move to the next lesson (if available)
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      // Optionally, you can redirect to the course completion page or show a message
      alert('You have completed all lessons!');
    }
  };

  // Get current lesson data based on index
  const currentLesson = lessons[currentLessonIndex];

  return (
    <Container className="main-content-container p-0 pb-4 bg-white">
      {/* Course Title */}
      <h1>{title.fa}</h1>
      <h3>{secondTitle.fa}</h3>

      {/* Display current lesson */}
      {currentLesson ? (
        <Card className="mb-4">
          <CardBody>
            {/* Lesson Title */}
            <CardTitle className={'season-title'}>{currentLesson.lessonTitle}</CardTitle>

            {/* Textbook Content */}
            {currentLesson.textbook && (
              <div
                className="lesson-textbook"
                dangerouslySetInnerHTML={{ __html: currentLesson.textbook }}
              />
            )}

            {/* Practice Text and Code */}
            {currentLesson.practiceText && (
              <div className="lesson-practice">
                <h5>{t('Practice')}</h5>
                <div
                  className="practice-text"
                  dangerouslySetInnerHTML={{ __html: currentLesson.practiceText }}
                />
                {currentLesson.practiceType === 'pythonCode' && currentLesson.practiceCode && (
                  <pre>
                    <code>{currentLesson.practiceCode}</code>
                  </pre>
                )}
              </div>
            )}

            {/* Continue Button */}
            <Button onClick={handleContinue} className="mt-3">
              {t('Continue')}
            </Button>
          </CardBody>
        </Card>
      ) : (
        <p>{t('No lessons available')}</p>
      )}

      {/* Back to Course Button */}
      {/*<Link to="/course/study" className="btn btn-secondary mt-3">*/}
        {/*{t('Back to Course')}*/}
      {/*</Link>*/}
    </Container>
  );
};

export default withTranslation()(CourseStudyLesson);
