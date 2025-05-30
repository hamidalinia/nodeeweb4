import { memo, useState } from 'react';
import { Col } from 'shards-react';

import { useTranslation } from 'react-i18next';

function FieldUploadMedia({ field }) {
  const { t } = useTranslation();
  const {
    size,
    className,
    name,
    label,
    placeholder,
    value,
    style,
    required = false,
    accept = 'image/*',
    multiple = false,
  } = field;
  let [theVal, setTheVal] = useState(value);

  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{t(label || name)}</label>
      <input
        name={name}
        accept={accept}
        multiple={multiple}
        style={style}
        required={required}
        type="file"
        placeholder={placeholder ? placeholder : label ? t(label) : t(name)}
        onChange={(e) => {
          field.setValue(name, e.target.files[0]);
        }}
        className="mb-2 form-control ltr"
      />
    </Col>
  );
}
export default memo(FieldUploadMedia);
