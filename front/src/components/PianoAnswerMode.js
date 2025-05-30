import React, {useState} from 'react';
import {Field} from 'react-final-form';
import {FieldQuestion} from '@/components/form/fields';
import {MainUrl, submitTest} from '@/functions';
import {withTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {toast} from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
const PianoAnswerMode = ({questions, className, _id,questionWrapperClasses, t}) => {
  const [qw, setQW] = useState(0)
  // const [submitTestLoader, setSubmitTestLoader] = useState(false)
  const [thein, setIndex] = useState(0)
  const [scoreBox, setScoreBox] = useState(false)
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  let x = [
    {"title": "C", "value": "do", "subtitle": "do"},
    {"title": "D", "value": "re", "subtitle": "re", "blackt": true},
    {"title": "E", "value": "mi", "subtitle": "mi", "blackt": true},
    {"title": "F", "value": "fa", "subtitle": "fa"},
    {"title": "G", "value": "sol", "subtitle": "sol", "blackt": true},
    {"title": "A", "value": "la", "subtitle": "la", "blackt": true},
    {"title": "B", "value": "si", "subtitle": "si", "blackt": true}
  ];
  let wrapperClassName = 'piano';
  let opts = (wrapperClassName === 'piano') ? x : options;
  let [radios, setRadios] = useState(opts);
  const handleAnswerold = (e) => {
    // console.log("e",e)
    console.clear();
    let text = e.target.value;
    let index = thein;
    let field = {}
    let item = questions[index];
    let answer = item.answer;
    console.log("item is: ", item)
    console.log("you clicked on: ", text)
    console.log("answer is: ", answer)
    if (text == answer) {
      console.log("correct answer", text)
      let PB = document.getElementsByClassName("piano-button-" + text)
      if (PB && PB[0] && PB[0].className) {
        PB[0].className += (" correct-choice");
        setTimeout(() => {
          PB[0]?.classList.remove("correct-choice");

        }, 500)
      }

      console.log("thein", thein, "length", questions?.length)
      if (thein < questions?.length)
        setIndex(thein + 1);
      if ((thein + 1) == questions?.length) {
        setScoreBox(true);
        console.log("we are finished");
      }

      document.getElementsByClassName("per-question-q" + index)[0].className += " mightFaded";
      document.getElementsByClassName("per-question-q" + (index + 1))[0]?.classList.remove("mightFaded");
      let wi = document.getElementsByClassName("per-question-q" + index)[0]?.offsetWidth;
      console.log('text', index, text, wi, ((index + 1) * parseInt(wi)))
      if (index + 1 < questions?.length)
        setQW(((index + 1) * parseInt(wi)))
    } else {
      console.log("wrong answer!", text)
      let PB = document.getElementsByClassName("piano-button-" + text)
      let QTP = document.getElementsByClassName("questions-type-piano")
      if (PB && PB[0] && PB[0].className) {
        PB[0].className += (" wrong-choice");
        setTimeout(() => {
          PB[0]?.classList.remove("wrong-choice");

        }, 500)
      }
      if (QTP && QTP[0] && QTP[0].className) {
        QTP[0].className += (" shake-animation");
        setTimeout(() => {
          QTP[0]?.classList.remove("shake-animation");

        }, 300)
      }


    }
  }


  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Optional: Show loading state (e.g., a spinner or loading indicator)
    setLoading(true);

    try {
      // Call the submitTest function (assumed to be an API call or logic)
      const data = await submitTest(_id, {
        score: totalScore,
        passed: true,
      });
      setScoreBox(false)
      // Handle success: you can add any necessary actions like updating state, redirecting, etc.
      toast.success(t("Test submitted successfully!"));

      // Do something with the data if necessary
      console.log("Submission data:", data);
      window.history.back();
      // Optional: Reset or update the form state after successful submission
      // form.reset();

    } catch (error) {
      // Handle error: Show an error message to the user
      console.error("Error occurred during test submission:", error);

      toast.error(t("An error occurred while submitting the test. Please try again."));
    } finally {
      // Optional: Hide loading indicator when the process is done
      setLoading(false);
    }
  };
  const handleAnswer = (e) => {
    console.clear();
    let text = e.target.value;
    let index = thein;
    let item = questions[index];
    let answer = item.answer;
    let score = item.score || 0;  // Assuming each question has a score attribute

    console.log("item is: ", item);
    console.log("you clicked on: ", text);
    console.log("answer is: ", answer);

    if (text == answer) {
      console.log("correct answer", text);
      let PB = document.getElementsByClassName("piano-button-" + text);
      if (PB && PB[0] && PB[0].className) {
        PB[0].className += (" correct-choice");
        setTimeout(() => {
          PB[0]?.classList.remove("correct-choice");
        }, 500);
      }

      // Accumulate the score
      setTotalScore((prevScore) => {
        const newScore = prevScore + score;
        console.log("Updated score:", newScore);  // Log the total score after updating
        return newScore;
      });

      console.log("thein", thein, "length", questions?.length);
      if (thein < questions?.length) setIndex(thein + 1);

      if ((thein + 1) == questions?.length) {
        setScoreBox(true);
        console.log("we are finished", totalScore);
      }

      document.getElementsByClassName("per-question-q" + index)[0].className += " mightFaded";
      document.getElementsByClassName("per-question-q" + (index + 1))[0]?.classList.remove("mightFaded");

      let wi = document.getElementsByClassName("per-question-q" + index)[0]?.offsetWidth;
      console.log('text', index, text, wi, ((index + 1) * parseInt(wi)));
      if (index + 1 < questions?.length) setQW(((index + 1) * parseInt(wi)));
    } else {
      console.log("correct answer is:", answer, 'but you choosed wrong answer');
      let PB = document.getElementsByClassName("piano-button-" + answer);
      if (PB && PB[0] && PB[0].className) {
        PB[0].className += (" correct-choice");
        setTimeout(() => {
          PB[0]?.classList.remove("correct-choice");
        }, 500);
      }
      let PB2 = document.getElementsByClassName("piano-button-" + text);
      let QTP2 = document.getElementsByClassName("questions-type-piano");
      if (PB2 && PB2[0] && PB2[0].className) {
        PB2[0].className += (" wrong-choice");
        setTimeout(() => {
          PB2[0]?.classList.remove("wrong-choice");
        }, 500);
      }
      if (QTP2 && QTP2[0] && QTP2[0].className) {
        QTP2[0].className += (" shake-animation");
        setTimeout(() => {
          QTP2[0]?.classList.remove("shake-animation");
        }, 300);
      }


      console.log("thein", thein, "length", questions?.length);
      if (thein < questions?.length) setIndex(thein + 1);

      if ((thein + 1) == questions?.length) {
        setScoreBox(true);
        console.log("we are finished", totalScore);
      }

      document.getElementsByClassName("per-question-q" + index)[0].className += " mightFaded";
      document.getElementsByClassName("per-question-q" + (index + 1))[0]?.classList.remove("mightFaded");

      let wi = document.getElementsByClassName("per-question-q" + index)[0]?.offsetWidth;
      console.log('text', index, text, wi, ((index + 1) * parseInt(wi)));
      if (index + 1 < questions?.length) setQW(((index + 1) * parseInt(wi)));

    }


    // else {
    //   console.log("wrong answer!", text);
    //   let PB = document.getElementsByClassName("piano-button-" + text);
    //   let QTP = document.getElementsByClassName("questions-type-piano");
    //   if (PB && PB[0] && PB[0].className) {
    //     PB[0].className += (" wrong-choice");
    //     setTimeout(() => {
    //       PB[0]?.classList.remove("wrong-choice");
    //     }, 500);
    //   }
    //   if (QTP && QTP[0] && QTP[0].className) {
    //     QTP[0].className += (" shake-animation");
    //     setTimeout(() => {
    //       QTP[0]?.classList.remove("shake-animation");
    //     }, 300);
    //   }
    // }
  };
  return <>
    <div style={{
      display: 'flex',
      justifyContent: 'left'
    }}>
      <Link
        url={'/profile'}
        className={clsx('btn', 'btn-primary', 'posrel', 'user-hear-whiteb', 'user-score-whiteb ')}
      >
        <span><MonetizationOnIcon className={'uhw-i'}/></span>
        <span
          style={{
            fontSize: '13px',
            paddingLeft: '10px',
            textAlign: 'left'
          }}
          className={'user-hear-whiteb-span'}>{totalScore}</span>

      </Link>
    </div>
    <div data-index={thein}
         className={'questions-wrapper-main ' + ("ton-icon-show ")+questionWrapperClasses}>

      <div className={'questions-wrapper cw-' + qw}
           style={{transform: "translate(-" + (qw) + "px)"}}>
        {questions?.map((item, index) => {
          let classes = item?.classes
          let name = 'name-' + index
          let backgroundImage = item?.backgroundImage || null
          return <div className={'per-question ' + (index !== 0 ? 'mightFaded' : '') + ' per-question-q' + index}>

            <label className={'qestion-help'} htmlFor={name}>


              <div className={'qestion-help-inside font-family-digi'}>
                {/*{label}*/}
              </div>
            </label>
            <div className={'lines-5 ' + classes}>
              <hr/>
              <hr/>
              <hr/>
              <hr/>
              <hr/>
            </div>
            {backgroundImage && <img src={MainUrl + '/' + backgroundImage}/>}

            {/*{index == field?.children?.length && <button>پایان</button>}*/}
          </div>

        })}
      </div>
      <div className={'per-question width-100 the-main-bar-' + wrapperClassName}>
        <div className={'d-flex questions-type-' + wrapperClassName}>
          {radios &&
          radios?.map((ch, i) => {
            return (
              <label key={i} className={'checkbox-items p-1 piano-button-' + (ch.value)}>
                {ch?.blackt && <div className={"blackt"}></div>}
                <Field
                  name={name}
                  component="input"
                  // style={style}
                  onClick={(e) => {
                    handleAnswer(e)
                    // onChange(e.target.value)
                  }}
                  type="radio"
                  value={ch.value}
                />
                {!ch.subtitle && <span>{ch.title}</span>}
                {ch.subtitle && <div className={'subtitle-ccc'}>
                  <div>{ch.title}</div>
                  <div>{ch.subtitle}</div>
                </div>}
              </label>
            );
          })}
        </div>
      </div>
      {scoreBox && <div className={"modal fade show"} style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(63, 81, 181, 0.7)"
      }}>
        <div className={'modal-dialog'}>
          <div className="modal-content">
            {/*<div className="modal-header">*/}
            {/*<h5 className="modal-title" id="exampleModalLiveLabel">{t("Your score:")}</h5>*/}

            {/*</div>*/}
            <div className="modal-body ltr font-family-sans-serif">
              <div  style={{fontSize:"38px",textAlign:"center"}}>{t("Your score")}</div>
              <div style={{fontSize:"60px",textAlign:"center"}}>{totalScore}</div>
            </div>
            <div className="modal-footer" style={{justifyContent:'center'}}>
              <button style={{backgroundColor:"#8317FF",
                alignItems:"center",
                display:"flex",
                gap:"10px"
              }} type="button" className="btn btn-secondary ltr" data-dismiss="modal" onClick={(e) => {
                handleSubmit(e)
              }}>
                <span>Finish</span>
                {loading && <CircularProgress style={{width:"30px",height:"30px"}}/>}

              </button>
              {/*<button type="button" className="btn btn-primary">مرحله بعد</button>*/}
            </div>
          </div>
        </div>
      </div>}
    </div>
  </>;
};

export default withTranslation()(PianoAnswerMode);
