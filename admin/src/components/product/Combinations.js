import { useEffect, useState } from 'react';
import {
  ArrayInput,
  FormDataConsumer,
  NumberInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';

import { ShowOptions } from '@/components';

export default (props) => {
  const { record, counter, updater, theST } = props;
  const translate = useTranslate();

  let combs = useWatch({ name: 'combinations' });
  const { setValue } = useFormContext();
  let [ST, setST] = useState(theST || []);
  const getStockStatus = (t) => {
    let r = ST[0];
    ST.forEach((item) => {
      if (item.value === t) {
        // console.log(' ==========================getStockStatus()',item)
        r = item;
      }
    });
    return r;
  };
  useEffect(() => {
    console.log('record', record);

    // setCombs(record);
  }, [record]);

  if (!(combs && combs.length > 0)) return props.counter;

  return (
    <ArrayInput
      source="combinations"
      label={translate('resources.product.combinations')}>
      <SimpleFormIterator>
        <FormDataConsumer>
          {({ formData, getSource, scopedFormData }) => {
            return (
              <div>
                <div className={'row'}>
                  <div className={'col-md-3'}>
                    <ShowOptions
                      source={getSource('options')}
                      label=""
                      sortable={false}
                      record={scopedFormData}
                    />
                  </div>
                  <div className={'col-md-3'}>
                    <SelectInput
                      fullWidth
                      label={translate('resources.product.stock')}
                      source={getSource('in_stock')}
                      choices={ST}
                    />
                    <NumberInput
                      fullWidth
                      source={getSource('quantity')}
                      min={0}
                      label={translate('resources.product.quantity')}
                    />
                  </div>

                  <div className={'col-md-3 ltr'}>
                    <TextInput
                      fullWidth
                      className={'ltr'}
                      value={'fds'}
                      source={getSource('price')}
                      format={(v) => {
                        if (!v) return '';

                        return v
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      }}
                      parse={(v) => {
                        if (!v) return '';

                        // return v.toString().replace(/,/g, "");
                        let x = v.toString().replace(/,/g, '');
                        return parseInt(x);
                      }}
                      label={translate('resources.product.price')}
                    />
                    <TextInput
                      fullWidth
                      className={'ltr'}
                      source={getSource('salePrice')}
                      format={(v) => {
                        if (!v) return '';
                        return v
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      }}
                      parse={(v) => {
                        if (!v) return '';

                        let x = v.toString().replace(/,/g, '');
                        return parseInt(x);
                      }}
                      label={translate('resources.product.salePrice')}
                    />
                  </div>

                  <div className={'col-md-3'}>
                    <NumberInput
                      fullWidth
                      className={'ltr'}
                      source={getSource('weight')}
                      min={0}
                      label={translate('resources.product.weight')}
                    />
                    <TextInput
                      fullWidth
                      className={'ltr'}
                      source={getSource('sku')}
                      label={translate('resources.product.sku')}
                    />
                  </div>
                </div>
                <div className={'row'}>
                  <div className={'col-md-3'}>
                    <TextInput
                      fullWidth
                      className={'ltr'}
                      source={getSource('normalBarcode')}
                      label={translate('resources.product.normalBarcode')}
                    />
                  </div>
                  {/*<div className={'col-md-3'}>*/}
                    {/*<TextInput*/}
                      {/*fullWidth*/}
                      {/*className={'ltr'}*/}
                      {/*source={getSource('maxPrice')}*/}
                      {/*label={translate('resources.product.maxPrice')}*/}
                    {/*/>*/}
                  {/*</div>*/}
                  {/*<div className={'col-md-3'}>*/}
                    {/*<TextInput*/}
                      {/*fullWidth*/}
                      {/*className={'ltr'}*/}
                      {/*source={getSource('minPrice')}*/}
                      {/*label={translate('resources.product.minPrice')}*/}
                    {/*/>*/}
                  {/*</div>*/}
                  {/*<div className={'col-md-3'}>*/}
                    {/*<TextInput*/}
                      {/*fullWidth*/}
                      {/*className={'ltr'}*/}
                      {/*source={getSource('formula')}*/}
                      {/*label={translate('resources.product.formula')}*/}
                    {/*/>*/}
                  {/*</div>*/}
                </div>
              </div>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
};
