import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import _get from 'lodash/get';
import clsx from 'clsx';

import CreateForm from '@/components/form/CreateForm';
import {
  MainUrl,
  getEntity,
  setStyles,
  submitForm,
  uploadPostFile,
} from '@/functions';
import LoadingContainer from '@/components/common/LoadingContainer';

const handleUpload = (file) => {
  if (!file) return;
  let formData = new FormData();
  formData.append('file', file);
  formData.append('type', file.type);
  return uploadPostFile(formData).then((data) => {
    if (data.success) return _get(data, 'media.url', null);

    return null;
  });
};

export default function Form({ element, formFields }) {
  const { t } = useTranslation();
  const [DATA, setData] = useState([]);
  const [theFormFields, setFormFields] = useState(null);

  const [loading, setLoading] = useState(true);
  const [theElements, setElement] = useState([]);
  let { data = {} } = element;
  const fields = _get(element, 'settings.general.fields', {});
  const { _id = '' } = fields;

  useEffect(() => {
    getEntity('form', _id)
      .then((resp) => {
        if (resp) {
          const { elements } = resp;
          setElement([...elements]);
          let formValues = [];
          let formFields = [];

          elements.forEach((d) => {
            const fields = _get(d, 'settings.general.fields', {});
            const { children } = d;

            const {
              name,
              label,
              value = '',
              placeholder,
              classes,
              options,
              showStepsTitle,
              required,
              sm=6,
              lg=6
            } = fields;
console.log("fields",fields)
            formFields[name] = value;
            let theChildren = [];
            if (children) {
              console.log("children",children)
              children.forEach((ch) => {
                // theChildren.push(lastObj);
                theChildren.push(ch);
              });
            }
            let lastObj = {
              type: d.name || 'string',
              label: label || name,
              name: name,
              showStepsTitle: showStepsTitle,
              size: {
                sm: sm || 6,
                lg: lg || 6,
              },
              onChange: (text) => {
                // setFields([...fields,])
                // this.state.checkOutBillingAddress.add.data[d] = text;
              },
              style: setStyles(fields),
              className: clsx(
                'rtl',
                classes && classes.map((ob) => ob.name || ob).join(' ')
              ),
              placeholder: placeholder,
              child: [],
              children: children || [],
              options: options || [],
              value,
              required: Boolean(required) || false,
            };
            if (typeof data[d] == 'object') lastObj.type = 'object';

            if (typeof data[d] == 'number') lastObj.type = 'number';

            if (typeof data[d] == 'string') {
            }

            formValues.push(lastObj);
          });
          setFormFields({ ...formFields });
          setData([...formValues]);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const handleSubmit = useCallback(
    async (v) => {
      console.log("theElements",theElements)
      setLoading(true);
      const values = { ...v };
      for (let key in values) {
        const value = values[key];
        if (value instanceof File) {
          const url = await handleUpload(value);
          values[key] = `${MainUrl}/${url}`;
        }
      }

      submitForm(_id, values)
        .then((d) => {
          if (d.success && d.message) {
            toast.success(t(d.message));
            const form = document.getElementById(_id) as HTMLFormElement;
            if (form) form.reset();
          }
        })
        .catch((e) => {
          console.error('err=>', e);
          toast.error(t('sth wrong happened!'));
        })
        .finally(() => setLoading(false));
    },
    [_id, t]
  );

  return (
    <LoadingContainer
      loading={loading}
      style={{ position: 'relative', minHeight: 400 }}>
      {theFormFields && DATA && (
        <CreateForm
          formFieldsDetail={fields}
          rules={{ fields: DATA }}
          onSubmit={handleSubmit}
          buttons={[]}
          theFields={DATA}
          fields={theFormFields}
        />
      )}
    </LoadingContainer>
  );
}
