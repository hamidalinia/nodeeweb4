import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Container} from 'shards-react';
import {toast} from 'react-toastify';
import { Form} from 'react-final-form';
import CircularProgress from '@mui/material/CircularProgress';
// import NormalAnswerMode from './NormalAnswerMode'; // Import the normal answer mode component
import PianoAnswerMode from '@/components/PianoAnswerMode'; // Import the piano answer mode component
import {getTest} from '@/functions'; // Import the piano answer mode component
import clsx from 'clsx';
import {withTranslation} from 'react-i18next';

const Test = ({t}) => {
  const {_id} = useParams(); // Get the test ID from URL
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [formData, setFormData] = useState({});
  const [answerMode, setAnswerMode] = useState("normal");
  const [qw, setQW] = useState(0);
  const [scoreBox, setScoreBox] = useState(false);

  // Fetch test data from the server
  const getTheTest = (_id) => {
    getTest(_id)
      .then((data) => {
        setTestData(data);
        setAnswerMode(data.answerMode || 'normal');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching test data:', error);
        setLoading(false);
      });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit form data
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      // Prepare data to submit
      const submittedData = {...formData};

      submitForm(_id, submittedData)
        .then((response) => {
          toast.success('Test submitted successfully');
          setFormData({});
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          toast.error('Something went wrong!');
        })
        .finally(() => setLoading(false));
    },
    [formData, _id]
  );

  useEffect(() => {
    getTheTest(_id);
  }, [_id]);

  if (loading) return <Container
    style={{textAlign:'center'}}
    className={clsx(
      'main-content-container p-0 kiuytyuioiu bg-white test-the-page-q'
    )}><CircularProgress /></Container>;

  if (!testData) return <Container
    className={clsx(
      'main-content-container p-0 kiuytyuioiu bg-white test-the-page-q'
    )}>{t("No test data found")}</Container>;

  const {questions, classes,questionWrapperClasses} = testData;

  return (
    <Container
      className={clsx(
        'main-content-container p-0 kiuytyuioiu bg-white',
        classes
      )}>
      <Form
        onSubmit={()=>{}}
        // initialValues={fields}
        mutators={{
          setValue: ([field, value], state, {changeValue}) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({handleSubmit, form}) => (
          <form
            onSubmit={handleSubmit}
            className="container"
            id={_id || ''}>

      {answerMode === "normal" ? (<>
          {/*<NormalAnswerMode*/}
          {/*question={question}*/}
          {/*formData={formData}*/}
          {/*handleInputChange={handleInputChange}*/}
          {/*/>*/}</>
      ) : (
        <PianoAnswerMode
          _id={testData?._id}
          questions={questions}
          className={classes}
          questionWrapperClasses={questionWrapperClasses}
        />
      )}


      {/*{scoreBox && (*/}
        {/*<div className="modal">*/}
          {/*<p>{`Your score: ${qw}`}</p>*/}
          {/*<button onClick={() => setScoreBox(false)}>Close</button>*/}
        {/*</div>*/}
      {/*)}*/}
          </form>
          )}
        />
    </Container>
  );
};

export default withTranslation()(Test);
