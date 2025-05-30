import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Button, Col, Form, FormInput, Row, Container } from 'shards-react';
// import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import FlightTakeoffTwoToneIcon from '@mui/icons-material/FlightTakeoffTwoTone';
import { searchFlights , getFromAi} from '#c/functions/index';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import IATA_code from './airports';
import { useEffect } from 'react';

const AskAi = (props) => {
  const [fromState, setfromState] = useState();

  const [valueDateDeparture, setValueDateDeparture] = useState(new Date());
  const [valueDateReturn, setvalueDateReturn] = useState(new Date());
  const [IATAState, setIATAState] = useState([]);

  const [response, setResponse] = useState('');

  const [query, setquery] = useState('');
  const [data, setData] = useState();

  const handleChange = (event) => {
    console.log(event.target.value);
    setquery(event.target.value)
    // const results = IATA_code.filter((item) => {
    //   // if (event.target.value === '') return IATA_code;
    //   // return item.name_fa
    //   setquery(e.target.value);
    //   setData(
    //     IATAState.map((item) => item).filter(function (item) {
    //       return item.name_fa.startsWith(fromState);
    //     })
    //   );
    //   // console.log(IATAState.map(item=>item.nAME_))
    //   console.log(data);
    //   // setIATAStateFil(IATAState.map((item)=>item.name_fa || item.name_en).filter(function (item) { return item.startsWith(fromState); }))
    //   // setIATAStateTo(IATAState.map((item)=>item.name_fa || item.name_en).filter(function (item) { return item.startsWith(fromState); }))
    // });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('query',query)
    getFromAi(query).then((text) =>{
      console.log("text", text)
      setResponse(text)
    })
  };

  return (
    <Container fluid className="main-content-container px-4 maxWidth1200">
      <Row style={{ marginTop: '100px' }}>
        <Col>
          <FormInput
            placeholder={'هرچه دل تنگت میخواهد بگو...'}
            className={'iuygfghuji'}
            type="text"
            dir="rtl"
            name="from"
            onChange={handleChange}
            value={query}
          />
        </Col>
        </Row>
<Row>
        <Col>
          <Button onClick={handleSubmit} className="searchDate-button">
            بپرس
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
        {response}
        </Col>
      </Row>
    </Container>
  );
};

export default withTranslation()(AskAi);
