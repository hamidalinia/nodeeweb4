import { useState, useEffect, memo } from 'react';
import {
  ArrayInput,
  FormDataConsumer,
  CheckboxGroupInput,
  SelectInput,
  SimpleFormIterator,
  useRecordContext,
  useTranslate,
} from 'react-admin';

import API from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
let ckjhg = {};

function AtrRefField(props) {
  const { source } = props;
  const translate = useTranslate();
  const record = useRecordContext();

  const [v, setV] = useState([]);
  const [defaultV, setDefaultV] = useState(
    record && record.firstCategory && record.firstCategory.name
      ? {
          value: record.firstCategory._id,
          label: record.firstCategory.name.fa,
        }
      : {}
  );
  const [g, setG] = useState([]);
  const [defaultG, setDefaultG] = useState(
    record && record.secondCategory && record.secondCategory.name
      ? {
          value: record.secondCategory._id,
          label: record.secondCategory.name.fa,
        }
      : {}
  );
  const [d, setD] = useState([]);

  const [selectS, setSelectS] = useState([true, true, true]);

  const getData = () => {
    API.get('' + props.url, {}, {}).then(({ data = [] }) => {
      var cds = [];
      data.forEach((uf, s) => {
        cds.push({
          values: uf.values,
          value: uf._id,
          label: uf.name && uf.name.fa ? uf.name.fa : uf.name,
          key: s,
        });
      });
      setV(cds);
      setSelectS([false, true, true]);
      changeSecondInput(defaultV);
    });
  };
  // const [progress, setProgress] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const changeSecondInput = (t, x = false) => {
    // setG([]);
    // setDefaultG({});
    //
    // setD([]);
    // setDefaultD({});

    // if (t.target.options.selectedIndex) {
    if (t.value) {
      let _id = t.value;
      // let _id = v[t.target.options.selectedIndex - 1]._id;
      ckjhg['firstCategory'] = _id;
      // props.returnToHome(ckjhg);
      API.get('' + props.surl + '/' + _id, {}, {}).then(({ data = [] }) => {
        let cds = [],
          catTemp = false;
        if (data && data.values && data.values[0]) {
          data.values.forEach((uf, s) => {
            cds.push({
              _id: uf._id,
              slug: uf.slug,
              name: uf.name && uf.name.fa ? uf.name.fa : uf.name,
              key: s,
            });
            if (defaultG && defaultG.value === uf._id) catTemp = true;
          });

          setG(cds);
          setD([]);
          setSelectS([false, false, true]);

          if (!catTemp) {
            setDefaultG({});
            changeThirdInput({});
          } else {
            changeThirdInput(defaultG);
          }
          // ResetCats();
        }
      });
    }
  };
  const returnChoices = (attribute) => {
    let ddd = [];
    v.forEach((f) => {
      if (f.value == attribute) {
        ddd = f.values;
      }
    });

    return ddd;
  };
  const changeThirdInput = (t) => {
    if (t && t.value) {
      let _id = t.value;
      ckjhg['secondCategory'] = _id;
      props.returnToHome(ckjhg);
    } else {
      setSelectS([false, false, false]);
    }
  };

  if (!v) return null;

  return (
    <ArrayInput
      source={source}
      label={translate('resources.product.attributes')}>
      <SimpleFormIterator {...props}>
        <FormDataConsumer>
          {({ scopedFormData, getSource, ...rest }) => {
            return (
              <div className={'row mb-20'}>
                <div className={'col-md-4'}>
                  {/*<Select*/}
                  {/*source={getSource("attribute")}*/}
                  {/*isRtl={true}*/}
                  {/*isLoading={selectS[0]}*/}
                  {/*isDisabled={selectS[0]}*/}
                  {/*className={"zindexhigh"}*/}
                  {/*defaultValue={defaultV}*/}
                  {/*onChange={changeSecondInput}*/}
                  {/*options={v}*/}
                  {/*/>*/}
                  <SelectInput
                    fullWidth
                    className={'mb-20'}
                    source={getSource('attribute')}
                    choices={v}
                    optionValue="value"
                    optionText="label"
                  />
                </div>
                <div className={'col-md-4'}>
                  <CheckboxGroupInput
                    source={getSource('values')}
                    choices={
                      scopedFormData
                        ? returnChoices(scopedFormData.attribute)
                        : []
                    }
                    onChange={(e) => {
                      console.log('e', e);
                    }}
                    optionValue="slug"
                    optionText={'name.' + translate('lan')}
                  />
                </div>
              </div>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default memo(AtrRefField);
