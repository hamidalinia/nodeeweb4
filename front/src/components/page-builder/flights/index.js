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

  const [valueDateDeparture, setValueDateDeparture] = useState(new Date());
  const [valueDateReturn, setvalueDateReturn] = useState(new Date());
  const [IATAState, setIATAState] = useState([]);

  const [query, setquery] = useState('');
  const [data, setData] = useState();

  const handleChange = (event) => {
    console.log(event.target.value);
    const results = IATA_code.filter((item) => {
      if (event.target.value === '') return IATA_code;
      // return item.name_fa
      setquery(e.target.value);
      setData(
        IATAState.map((item) => item).filter(function (item) {
          return item.name_fa.startsWith(fromState);
        })
      );
      // console.log(IATAState.map(item=>item.nAME_))
      console.log(data);
      // setIATAStateFil(IATAState.map((item)=>item.name_fa || item.name_en).filter(function (item) { return item.startsWith(fromState); }))
      // setIATAStateTo(IATAState.map((item)=>item.name_fa || item.name_en).filter(function (item) { return item.startsWith(fromState); }))
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
            value={query}
          />
          {IATAState.length > 0
            ? IATAState.map((item) => (
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
            dir="rtl"
            onChange={handleChange}
          />

          {IATAState.length > 0
            ? IATAState.map((item) => (
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
