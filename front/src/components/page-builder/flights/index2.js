import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Button, Col, Form, FormInput, Row, Container } from 'shards-react';
// import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import FlightTakeoffTwoToneIcon from '@mui/icons-material/FlightTakeoffTwoTone';
import { searchFlights } from '#c/functions/index';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import IATA_code from './airports';
import { useEffect } from 'react';

const Flights = (props) => {
  const [fromState, setfromState] = useState();
  const [toState, setTostate] = useState();
  const [valueDateDeparture, setValueDateDeparture] = useState(new Date());
  const [valueDateReturn, setvalueDateReturn] = useState(new Date());
  const [IATAState, setIATAState] = useState([]);
  const [IATAStateFil, setIATAStateFil] = useState([]);
  const [IATAStateTo, setIATAStateTo] = useState([]);

  // console.log(IATAStateFil.length()

  // HANDLE CHANGE

  const handleChange = (event) => {
    console.log(event.target.value);
    console.log(
      'this is ',
      IATAState.map((item) => {
        return item;
      }).filter(function (item) {
        return item.IATA_code.startsWith(fromState);
      })
    );
    // console.log(IATAState.map(item=>item.nAME_))
    setIATAStateFil(
      IATAState.map((item) => item.name_fa || item.name_en).filter(function (
        item
      ) {
        return item.startsWith(fromState);
      })
    );
    setIATAStateTo(
      IATAState.map((item) => item.name_fa || item.name_en).filter(function (
        item
      ) {
        return item.startsWith(fromState);
      })
    );

    //  IATAState.filter((item)=> item.name_fa===fromState))
    // console.log(IATAStateFil)
    setfromState(event.target.value);
    setTostate(event.target.value);
    console.log(fromState, toState);
  };

  // useEffect(() => {
  //   // setIATAState(IATA_code)

  // }, [IATAStateFil,IATAStateTo,fromState]);
  //   const filterSearchFrom =IATAState.filter((prg) => {

  //     let name = prg.name_fa;
  //     return name.includes(Tostate);
  // })
  // HANDLE SUBMIT
  const handleSubmit = (event) => {
    event.preventDefault();
    let sss = [];
    sss.push(fromState, valueDateDeparture, valueDateReturn);
    // console.log(searchState)
    // console.log(valueDateDeparture,valueDateReturn)
    // console.log("DeP",valueDateDeparture)
    // console.log("DeR",valueDateReturn)

    // setallState({searchState,valueDateDeparture,valueDateReturn})
    console.log(sss);
  };

  return (
    <Container fluid className="main-content-container px-4 maxWidth1200">
      <Row style={{ marginTop: '100px' }}>
        <Col>
          <FormInput
            placeholder={'مبدا'}
            className={'iuygfghuji'}
            type="text"
            dir="rtl"
            name="from"
            onChange={handleChange}

            //   value={inputgpt}
            //   onChange={(e) => setInputGpt(e.target.value)}
          />
          {IATAStateFil.length > 0
            ? IATAStateFil.map((item) => (
                <div className="searchDate-dorpdown">
                  <div className="searchDate-dorpdown-item">
                    <span>
                      <LocationOnIcon />
                      <span>{item}</span>
                      {/* <span >{item.IATA_code}</span>  */}
                    </span>
                  </div>
                </div>
              ))
            : ' '}
        </Col>
        <Col>
          <FormInput
            placeholder={'مقصد'}
            className={'iuygfghuji'}
            type="text"
            name="to"
            dir="rtl"
            onChange={handleChange}
            // value={valueDateDeparture}
          />

          {IATAStateTo.length > 0
            ? IATAStateTo.map((item) => (
                <div className="searchDate-dorpdown">
                  <div className="searchDate-dorpdown-item">
                    <span>
                      <LocationOnIcon />
                      <span>{item}</span>
                      {/* <span >{item.IATA_code}</span>  */}
                    </span>
                  </div>
                </div>
              ))
            : ' '}
        </Col>
        <Col style={{ display: 'flex', direction: 'rtl' }}>
          <DatePicker
            value={valueDateDeparture}
            containerClassName="datePickerّFlight"
            onChange={setValueDateDeparture}
            placeholder="تاریخ رفت"
            calendar={persian}
            locale={persian_fa}
          />
          {/* <DatePicker  
      value={valueDateReturn}
      className='datePickerّFlight'
      onChange={setvalueDateReturn}
      placeholder='تاریخ برگشت'
      calendar={persian}
      locale={persian_fa}
      
    /> */}
        </Col>
        <Col>
          <Button onClick={handleSubmit} className="searchDate-button">
            جستجو
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default withTranslation()(Flights);
