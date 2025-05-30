// import IATA_code from './airports';
import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Button, Col, Container, FormInput, Row} from 'shards-react';
// import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import {getFromAi, searchFlights} from '#c/functions/index';
import {Field, Form} from 'react-final-form';

const VisualIdentity = (props) => {
  const [fromState, setfromState] = useState();

  const [valueDateDeparture, setValueDateDeparture] = useState(new Date());
  const [valueDateReturn, setvalueDateReturn] = useState(new Date());
  const [IATAState, setIATAState] = useState([]);

  const [response, setResponse] = useState('');

  const [query, setquery] = useState('');
  const [data, setData] = useState();

  const get_value = (jj) => {
    if (typeof jj?.value == 'string') {
      return (jj.value)
    }

    if (typeof jj?.value == 'object') {
      if (jj?.value instanceof Array) {
        if (typeof jj?.value[0] == 'string') {
          return jj?.value.join(" ، ")
        }
        if (typeof jj?.value[0] == 'object') {
          return jj?.value.map((val)=>{
            let pp=Object.keys(val);
            return pp.map((thp)=>{
              return <div className={'d-flex'}>
                <div>{thp}:</div>
                <div>{" "}{val[thp]}</div>
              </div>

            })
          });

        }
      } else {
        return 'object';

      }
    }
    if (jj?.value instanceof Array)
      if (typeof jj?.value[0] == 'object') {
        return JSON.stringify(jj.value[0])
      } else
        return jj.value.join(" ")
    else JSON.stringify(jj.value)
  }
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

  // const onSubmit = (event) => {
  //
  // }
  const onSubmit = (v, form) => {
    // console.log("onSubmit", v, form)
    event.preventDefault();
    // console.log('query', query)
    let attributes = v?.attributes?.join(' ، ');
    console.log('onSubmit', attributes)
    let x = '';
    x = ' فرض کن کالای من ' + query + ' هست و صفات شخصیتی غالب برند من شامل: ' +
      attributes +
      ' باشد. حالا چارچوب هویت برند را به تفکیک عناصر زیر با مقادیر ترجیحا به زبان فارسی در قالب کد json به من بده که آرایه ای حاوی object هایی باشد که هر object شامل property های section و value که value یا حاوی string باشد یا حاوی array باشد' +
      ' ' +
      'در پاسخ به غیر از object json هیچ کلمه و کاراکتر و حرف اضافه دیگه ای نفرست' +
      'عناصر مد نظر من شامل اینها می شود:' +
      'ارکتایپ های برند در سه لایه ی اصلی، مرکزی و موقعیتی .' +
      'رنگهای مجاز برند به ترتیب اولویت.' +
      'لحن برند.' +
      'کلمات کلیدی برند.' +
      'پرسونای برند، سبک موسیقی متناسب با برند با ذکر مثال،' +
      'رایحه متناسب با برند با ذکر مثال، باید ها و نباید های هویتی در تبلیغات برند،' +
      'برندهای .معروف با شخصیت مشابه باید ها و نباید های برند در نوشتن محتوا و کپی رایتینگ.' +
      'سفیر برند پیشنهادی.' +
      'یک سناریوی خلاقانه برای بیلبورد یا تبلیغات بنری';
    console.log("x", x)
    getFromAi(x).then((text) => {
      text = text?.replace("```json", "")
      text = text?.replace("```", "")
      let j = JSON.parse(text);
      console.log("j", j)

      // if()
      setResponse(j)
    })
  };

  return (
    <Container fluid className="main-content-container px-4 maxWidth1200">
      <Form
        onSubmit={onSubmit}
        initialValues={{
          query: "",
          attributes: [],

        }}

        mutators={{
          setValue: ([field, value], state, {changeValue}) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({handleSubmit, form}) => (
          <form onSubmit={handleSubmit}>
            <Row style={{marginTop: '50px'}}>
              <Col>
                <p>
                  برای اینکه به چهارچوب هویت برند خود برسید، ابتدا باید مشخص کنید کدام یک از صفات شخصیتی زیر با برند شما
                  همخوانی بیشتری دارند. میتوانید حداکثر سه گزینه انتخاب کنید:
                </p>
                <FormInput
                  placeholder={'نام کالا یا محصول خود را وارد کنید'}
                  className={'iuygfghuji'}
                  type="text"
                  dir="rtl"
                  name="query"
                  onChange={handleChange}
                  value={query}
                />
                <div className={'all-checkboxes'}>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'دانا و خردمند'}

                    />
                    <span>دانا و خردمند</span>
                  </label>

                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'با اراده و مصمم'}
                    />
                    <span>با اراده و مصمم</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'معصوم و صادق'}
                    />
                    <span>معصوم و صادق</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'احساسی و پر از عشق'}
                    />
                    <span>احساسی و پر از عشق</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'متواضع و خاکی'}
                    />
                    <span>متواضع و خاکی</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'کنجکاو و ماجراجو'}
                    />
                    <span>کنجکاو و ماجراجو</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'حمایتگر و فداکار'}
                    />
                    <span>حمایتگر و فداکار</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'شوخ طبع و سرگرم کننده'}
                    />
                    <span>شوخ طبع و سرگرم کننده</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'خلاق و نوآور'}
                    />
                    <span>خلاق و نوآور</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'چارچوب شکن و جسور'}
                    />
                    <span>چارچوب شکن و جسور</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'قدرتمند و ریاست طلب'}
                    />
                    <span>قدرتمند و ریاست طلب</span>
                  </label>
                  <label className={'checkbox-items p-1'}>
                    <Field
                      name={'attributes'}
                      component="input"
                      type="checkbox"
                      value={'رویاپرداز و دارای چوب جادویی'}
                    />
                    <span>رویاپرداز و دارای چوب جادویی</span>
                  </label>
                </div>

              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  // onClick={(e) => onSubmit(e)}
                  type={"submit"}
                  className="searchDate-button">
                  بپرس
                </Button>
              </Col>

            </Row>
          </form>
        )}
      />
      <Row>
        <Col>
          {response && response.map((jj, i) => {
            return <div key={i} className={'main-section-s'}>
              <div className={'labl'}>{jj?.section}</div>
              <div>{get_value(jj)}</div>

            </div>

          })}
        </Col>
      </Row>

    </Container>
  );
};

export default withTranslation()(VisualIdentity);
