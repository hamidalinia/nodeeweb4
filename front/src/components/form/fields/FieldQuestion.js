import React, {useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field} from 'react-final-form';
import {Col} from 'shards-react';
import {getEntitiesForAdmin, MainUrl, uploadMedia} from '#c/functions/index';

function FieldQuestion(props) {
  let {field, t} = props;
  console.log("props", props);
  let {
    type,
    style,
    kind,
    classes,
    size,
    className,
    entity,
    searchbox = true,
    limit = 1000,
    name,
    backgroundImage,
    wrapperClassName,
    options = [],
    onChange,
    label,
    placeholder,
    value,
  } = field;
  if (wrapperClassName) {
    // return JSON.stringify(options);
    // return wrapperClassName;
  }
  let x = [
    {"title": "C", "value": "C", "subtitle": "do"},
    {"title": "D", "value": "D", "subtitle": "re", "blackt": true},
    {"title": "E", "value": "E", "subtitle": "mi", "blackt": true},
    {"title": "F", "value": "F", "subtitle": "fa"},
    {"title": "G", "value": "G", "subtitle": "sol", "blackt": true},
    {"title": "A", "value": "A", "subtitle": "la", "blackt": true},
    {"title": "B", "value": "B", "subtitle": "ti", "blackt": true}
  ];
  let opts = (wrapperClassName == 'piano') ? x : options;
  let [radios, setRadios] = useState(opts);
  let [search, setSearch] = useState('');
  useEffect(() => {
    if (limit) {
      limit = parseInt(limit);
    }
    if (entity && radios.length === 0)
      getEntitiesForAdmin(entity, 0, limit)
        .then((d) => {
          setRadios(d);
        })
        .catch((e) => {
        });
  }, []);
  useEffect(() => {
    //   if (options != checkboxes)
    //     setCheckBoxes([...options])
  }, []);
let classe=classes?.split(" ")
  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <Field
        name={name}
      >
        {({input, meta}) => {
          return (
            <>
              <label className={'qestion-help'} htmlFor={name}>


                <div className={'qestion-help-inside font-family-digi'}> {label}</div>
              </label>
              {/*{classe[0]}*/}
              {classe[0] == 'lines-5' && <div className={classes}>
                <hr/>
                <hr/>
                <hr/>
                <hr/>
                <hr/>
              </div>}
              {backgroundImage && <img src={MainUrl + '/' + backgroundImage}/>}

            </>
          );
        }}
      </Field>
    </Col>
  );
}

export default withTranslation()(FieldQuestion);
