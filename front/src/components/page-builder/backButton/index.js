import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from 'shards-react';

const BackButton = (props) => {
  let { match, location, history, t, url } = props;
  let { element = {}, params = {} } = props;
  let { data = {}, settings = {} } = element;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let {
    entity = '',
    customQuery,
    populateQuery,
    classes,
    showInMobile,
    action,
    text,
  } = fields;
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  // return <div>"hi"</div>;
  return (
    <Button
      onClick={goBack}
      className={
        (classes !== undefined ? classes : '') +
        (showInMobile ? ' showInMobile ' : '')
      }
      style={props.classes}>
      {/* {Icons[iconFont] && <span>{React.createElement(Icons[iconFont])}</span>} */}
      <span>{text}</span>
    </Button>
  );
};
export const HomeServer = [];
export default withTranslation()(BackButton);
