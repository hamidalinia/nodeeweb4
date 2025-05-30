import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';
import clsx from 'clsx';

import { getEntitiesForAdmin } from '@/functions';

export default function FieldSelect({ field, style }) {
  const { t } = useTranslation();

  let {
    size,
    className,
    entity,
    optionName,
    optionValue,
    onChange,
    required,
    options = [],
    limit = 1000,
    name,
    label,
    placeholder = 'انتخاب کنید',
    value,
  } = field;

  let [theVal, setTheVal] = useState(value);
  let [list, setList] = useState(options || []);

  useEffect(() => {
    if (limit) limit = parseInt(limit);

    if (entity && list.length === 0)
      getEntitiesForAdmin(entity, 0, limit)
        .then((d) => {
          setList(d);
        })
        .catch((e) => {});
  }, []);
  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={clsx('MGD', className)}>
      <label htmlFor={name}>{label === name ? '' : t(label)}</label>

      <Field
        name={name}
        component="select"
        type="select"
        allowNull
        required={required}
        style={style}
        className="mb-2 form-control"
        onChange={(e) => {
          // console.log('e',e.target.value,field)
          setTheVal(e.target.value);
          if (onChange) {
            let ty = list.filter((i, idx) => {
              if (optionValue) return i[optionValue] === e.target.value;
              if (!optionValue) return i['value'] === e.target.value;
            });
            // console.log('ty', ty)
            if (ty && ty[0] && ty[0].values) e.list = ty[0].values;
            field.setValue(name, e.target.value);

            onChange(e);
          } else field.setValue(name, e.target.value);
        }}>
        <option value="">{placeholder}</option>
        {list.map((item, idx) => (
          <option
            key={idx}
            value={optionValue ? item[optionValue] : item.value}>
            {optionName ? item[optionName] : t(item.title)}
          </option>
        ))}
      </Field>
    </Col>
  );
}
