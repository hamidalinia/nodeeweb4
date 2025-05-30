import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Field, Form} from 'react-final-form';
import {Button, Col, Row} from 'shards-react';
import {useSelector} from 'react-redux';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import clsx from 'clsx';

import {MainUrl, uploadMedia} from '@/functions';
import {
  FieldArray,
  FieldBoolean,
  FieldCheckbox,
  FieldCheckboxes,
  FieldJson,
  FieldNumber,
  FieldObject,
  FieldPrice,
  FieldQuestion,
  FieldRadio,
  FieldSelect,
  FieldServer,
  FieldTextarea,
  FieldUploadDocument,
  FieldUploadMedia,
} from '@/components/form/fields';
import DemoSteps from '@/components/page-builder/stepper/demo';
import LoadingContainer from '../common/LoadingContainer';

function isPromise(p) {
  if (
    p !== null &&
    typeof p === 'object' &&
    typeof p.then === 'function' &&
    typeof p.catch === 'function'
  )
    return true;

  return false;
}

const TheField = ({field, t, fields, onSubmit, rerender}) => {
  if (!field) return <>no field</>;

  const {
    type,
    style,
    size,
    className,
    disabled = false,
    name,
    label,
    placeholder,
    required,
  } = field;
  const [qw, setQW] = useState(0)
  const [thein, setIndex] = useState(0)
  const [scoreBox, setScoreBox] = useState(false)

  // if ((type==='radiobuttonitem')) {
  //   return <Col
  //     sm={fields.sm ? fields.sm : ''}
  //     lg={fields.lg ? fields.lg : ''}
  //     className={clsx('MGD', className)}>
  //     <label htmlFor={name}>{fields.label}</label>

  //       {/* <input type="radio" id="radioApple" name="radioFruit" value="apple" checked />
  //       <label for="radioApple">Apple</label> */}

  //     <Field
  //       name={fields.name}
  //       component="radio"
  //       type="radio"
  //       placeholder={fields.placeholder ? fields.placeholder : ''}
  //       className="mb-2 form-control"
  //       disabled={disabled}
  //       style={dynamicStyle}

  //     />
  //   </Col>
  // }
  switch (type) {
    case 'radiobuttonlists':
      return (
        <Col
          sm={fields.sm ? fields.sm : ''}
          lg={fields.lg ? fields.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{fields.label}</label>
          <div className="radio-toolbar">
            <input
              type="radio"
              id="radioApple"
              name="radioFruit"
              value="apple"
              checked
            />
            <label for="radioApple">Apple</label>
          </div>
          {/*




        <Field
          name={fields.name}
          component="button"
          type="button"
          placeholder={fields.placeholder ? fields.placeholder : ''}
          className="mb-2 form-control"
          disabled={disabled}
          style={dynamicStyle}

        /> */}
        </Col>
      );
    case 'document':
      return <FieldUploadDocument field={field}/>;
    case 'media':
      return <FieldUploadMedia field={field}/>;

    case 'button':
      return (
        <Col
          sm={fields.sm ? fields.sm : ''}
          lg={fields.lg ? fields.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{fields.label}</label>
          <Field
            name={fields.name}
            component="button"
            type="button"
            placeholder={fields.placeholder ? fields.placeholder : ''}
            className="mb-2 form-control"
            disabled={disabled}
            // style={dynamicStyle}
          />
        </Col>
      );

    case 'date':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <Field
            name={name}
            component="input"
            type="date"
            placeholder={placeholder || label}
            className="mb-2 form-control"
            style={style}
          />
        </Col>
      );

    case 'steps':
      return <DemoSteps field={field} onSubmit={onSubmit}/>;

    case 'price':
      return <FieldPrice field={field}/>;

    case 'json':
      return <FieldJson field={field}/>;
    case 'slider':
      return (
        <SWIPERWrapper element={element} content={content} params={params}/>
      );
    case 'object':
      return <FieldObject field={field}/>;

    case 'array':
      return <FieldArray field={field}/>;

    case 'checkbox':
      return <FieldCheckbox field={field}/>;

    case 'checkboxes':
      return <FieldCheckboxes field={field}/>;

    case 'radio':
      return <FieldRadio field={field}/>;

    case 'question':
      // return JSON.stringify(field);
      return <FieldRadio field={field}/>;

    case 'questions':
      let x = [
        {"title": "C", "value": "C", "subtitle": "do"},
        {"title": "D", "value": "D", "subtitle": "re", "blackt": true},
        {"title": "E", "value": "E", "subtitle": "mi", "blackt": true},
        {"title": "F", "value": "F", "subtitle": "fa"},
        {"title": "G", "value": "G", "subtitle": "sol", "blackt": true},
        {"title": "A", "value": "A", "subtitle": "la", "blackt": true},
        {"title": "B", "value": "B", "subtitle": "si", "blackt": true}
      ];
      let wrapperClassName = 'piano';
      let opts = (wrapperClassName == 'piano') ? x : options;
      let [radios, setRadios] = useState(opts);
      return <div data-index={thein}
                  className={'questions-wrapper-main ' + ((className.indexOf("all-questions") > -1) ? "ton-icon-show" : "")}>
        <div className={'questions-wrapper cw-' + qw}
             style={{transform: "translate(-" + (qw) + "px)"}}>
          {field?.children?.map((item, index) => {
            let f = item?.settings?.general?.fields;
            let lastObj = {
              id: index,
              type: "question",
              label: f.name,
              name: f.name,
              size: {
                sm: 12,
                lg: 12,
              },
              onChange: (text) => {
                console.clear();
                // console.log("text",text)
                // console.log("item",item?.settings?.general?.fields?.answer)
                // // return
                // document.getElementsByClassName("per-question-q" + index)[0].className += " mightFaded";
                // document.getElementsByClassName("per-question-q" + (index + 1))[0]?.classList.remove("mightFaded");
                // let wi = document.getElementsByClassName("per-question-q" + index)[0]?.offsetWidth;
                // console.log('text', index, text, wi, ((index + 1) * parseInt(wi)))
                // if (index + 1 < field?.children?.length)
                //   setQW(((index + 1) * parseInt(wi)))
              },
              className: 'rtl',
              placeholder: '',
              child: [],
              ...f,
            };
            return <div className={'per-question ' + (index !== 0 ? 'mightFaded' : '') + ' per-question-q' + index}>
              <FieldQuestion field={lastObj}/>
              {index == field?.children?.length && <Button>پایان</Button>}
            </div>

          })}
        </div>
        <div className={'per-question width-100 the-main-bar-'+wrapperClassName}>
          <div className={'d-flex questions-type-' + wrapperClassName}>
            {radios &&
            radios?.map((ch, i) => {
              return (
                <label key={i} className={'checkbox-items p-1 piano-button-' + (ch.title)}>
                  {ch?.blackt && <div className={"blackt"}></div>}
                  <Field
                    name={name}
                    component="input"
                    style={style}
                    onClick={(e) => {
                      // console.log("e",e)
                      console.clear();
                      let text = e.target.value;
                      let index = thein;

                      let item = field?.children[index];
                      let answer = item?.settings?.general?.fields?.answer;
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
                        console.log("thein",thein,"length",field?.children?.length)
                        if (thein < field?.children?.length)
                          setIndex(thein + 1);
                        if((thein+1) == field?.children?.length) {
                          setScoreBox(true);
                          console.log("we are finished");
                        }

                        document.getElementsByClassName("per-question-q" + index)[0].className += " mightFaded";
                        document.getElementsByClassName("per-question-q" + (index + 1))[0]?.classList.remove("mightFaded");
                        let wi = document.getElementsByClassName("per-question-q" + index)[0]?.offsetWidth;
                        console.log('text', index, text, wi, ((index + 1) * parseInt(wi)))
                        if (index + 1 < field?.children?.length)
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
        {scoreBox && <div className={"modal fade show"} style={{display:"flex",alignItems:"center",justifyContent:"center",backgroundColor: "rgba(63, 81, 181, 0.7)"}}>
          <div className={'modal-dialog'}>
            <div className="modal-content">
              {/*<div className="modal-header">*/}
                {/*<h5 className="modal-title" id="exampleModalLiveLabel">{t("Your score:")}</h5>*/}

              {/*</div>*/}
              <div className="modal-body">
                <p>{t("Your score")}:</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">بازگشت</button>
                <button type="button" className="btn btn-primary">مرحله بعد</button>
              </div>
            </div>
          </div>
        </div>}
      </div>;

    case 'select':
      return <FieldSelect field={field} style={style}/>;

    case 'server':
      return <FieldServer field={field}/>;

    case 'number':
      return <FieldNumber field={field}/>;

    case 'string':
    case 'input':
    case '':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label || label}</label>
          <Field
            name={name}
            component="input"
            type="text"
            placeholder={placeholder || label}
            className="mb-2 form-control"
            disabled={disabled}
            style={style}
            required={required}
          />
          {/*<FieldText*/}
          {/*  name={name}*/}
          {/*  component="input"*/}
          {/*  type="text"*/}
          {/*  placeholder={placeholder || label}*/}
          {/*  className="mb-2 form-control"*/}
          {/*  disabled={disabled}*/}
          {/*  style={style}*/}
          {/*/>*/}
        </Col>
      );

    case 'textarea':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label === name ? '' : label}</label>
          <FieldTextarea
            name={name}
            style={style}
            placeholder={placeholder || label}
            className="mb-2 form-control"
          />
        </Col>
      );

    case 'boolean':
      return <FieldBoolean field={field}/>;

    case 'image':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{t(label)}</label>
          <Field style={style} name={name} className="mb-2 form-control">
            {(props) => {
              return (
                <div className="max-width100">
                  <img
                    loading="lazy"
                    alt="img"
                    style={{width: '100px'}}
                    src={MainUrl + '/' + props.input.value}
                  />
                  {!props.input.value && (
                    <input
                      name={props.input.name}
                      onChange={(props) => {
                        let {target} = props;
                        console.log(props);
                        console.log(target.files[0]);
                        uploadMedia(target.files[0], (e) => {
                          // console.log('e', e)
                        }).then((x) => {
                          if (x.success && x.media && x.media.url) {
                            // console.log('set', name, x.media.url)

                            field.setValue(name, x.media.url);
                          }
                        });
                      }}
                      type={'file'}
                    />
                  )}
                  {props.input.value && (
                    <div className={'posrel'}>
                      <img
                        src={MainUrl + '/' + props.input.value}
                        loading="lazy"
                        alt="img"
                      />
                      <Button
                        onClick={(e) => {
                          field.setValue(name, '');
                        }}
                        className={'removeImage'}>
                        <RemoveCircleOutlineIcon/>
                      </Button>
                    </div>
                  )}
                </div>
              );
            }}
          </Field>
        </Col>
      );

    case 'images':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <Field style={style} name={name} className="mb-2 form-control">
            {(props) => {
              return (
                <div className={'max-width100'}>
                  {!props.input.value && (
                    <input
                      name={props.input.name}
                      onChange={(props) => {
                        let {target} = props;
                        uploadMedia(target.files[0], (e) => {
                          console.log('e', e);
                        }).then((x) => {
                          if (x.success && x.media && x.media.url) {
                            field.setValue(name, x.media.url);
                          }
                        });
                      }}
                      type={'file'}
                    />
                  )}
                  {props.input.value && (
                    <img
                      src={MainUrl + '/' + props.input.value}
                      alt="img"
                      loading="lazy"
                    />
                  )}
                </div>
              );
            }}
          </Field>
        </Col>
      );
    default:
      return null;
  }
};

export default function CreateForm({
                                     fields,
                                     rules = {fields: []},
                                     theFields = undefined,
                                     formFieldsDetail = {},
                                     ...props
                                   }) {
  const {t} = useTranslation();

  const themeData = useSelector((st) => st.store.themeData);

  const [loading, setLoading] = useState(false);
  const [render, setrender] = useState(1);
  const [theRules, setTheRules] = useState({...{fields: rules.fields}});

  useEffect(() => {
    if (
      !theRules ||
      (theRules && !theRules.fields) ||
      (theRules.fields && !theRules.fields[0])
    ) {
      Object.keys(fields).forEach((fi) => {
        let typ = typeof fields[fi];
        if (fields[fi] instanceof Array) {
          typ = 'select';
        }
        rules.fields.push({
          name: fi,
          type: typ,
        });
      });
      setTheRules(rules);
    } else {
      setTheRules(rules);
    }
  }, [theRules, fields, rules]);

  if (!themeData) return;

  const rerender = (e) => {
    console.log("hi")
    setrender(render + 1)
  }
  const onSubmit = (v, form) => {
    if (!props.onSubmit) return;

    let values = v;

    setLoading(true);
    if (theRules && theRules.fields)
      theRules.fields.forEach((item, i) => {
        if (
          item.type === 'object' &&
          values[item.name] instanceof Array &&
          item.value
        ) {
          let obj = {};
          item.value.forEach((its) => {
            if (its) obj[its.property] = its.value;
          });
          values[item.name] = obj;
        }
      });

    if (isPromise(props.onSubmit)) {
      props
        .onSubmit(values)
        .then(() => form.reset())
        .finally(() => setLoading(false));
    } else {
      props.onSubmit(values);
      // form.reset();
      setLoading(false);
    }
  };

  return (
    <LoadingContainer loading={loading}>
      {/*{render}*/}
      <Form
        onSubmit={onSubmit}
        initialValues={fields}
        mutators={{
          setValue: ([field, value], state, {changeValue}) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({handleSubmit, form}) => (
          <form
            onSubmit={handleSubmit}
            className="container"
            id={formFieldsDetail._id || ''}>
            <Row>
              {theFields
                ? theFields.map((field, index) => {
                  if (fields[field.name]) field.value = fields[field.name];

                  let lastObj = {
                    id: index,
                    type: field.type,
                    children: field.children,
                    label: field.name,
                    name: field.name,
                    size: {
                      sm: 6,
                      lg: 6,
                    },
                    onChange: (text) => {
                    },
                    className: 'rtl',
                    placeholder: '',
                    child: [],
                    setValue: form.mutators.setValue,
                    ...field,
                  };
                  if (field.value) lastObj['value'] = field.value;

                  return (
                    <TheField
                      t={t}
                      fields={fields}
                      onSubmit={onSubmit}
                      key={index}
                      rerender={(e) => rerender(e)}

                      field={lastObj}
                    />
                  );
                })
                : theRules?.fields?.map((field, index) => {
                  if (fields[field.name]) {
                    field.value = fields[field.name];
                  }
                  let lastObj = {
                    id: index,
                    type: field.type,
                    label: field.name,
                    name: field.name,
                    size: {
                      sm: 6,
                      lg: 6,
                    },
                    onChange: (text) => {
                    },
                    className: 'rtl',
                    placeholder: '',
                    child: [],
                    setValue: form.mutators.setValue,
                    ...field,
                  };
                  if (field.value) {
                    lastObj['value'] = field.value;
                  }
                  return (
                    <TheField
                      t={t}
                      fields={fields}
                      onSubmit={onSubmit}
                      rerender={(e) => rerender(e)}
                      key={index}
                      field={lastObj}
                    />
                  );
                })}
              {formFieldsDetail.showSubmitButton && (
                <div className="buttons">
                  <Button type="submit">{t('Submit')}</Button>
                </div>
              )}
            </Row>
          </form>
        )}
      />
    </LoadingContainer>
  );
}
