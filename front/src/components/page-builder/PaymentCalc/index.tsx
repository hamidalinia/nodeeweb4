import { useEffect, useState } from 'react';
import { Col, Row, FormCheckbox } from 'shards-react';
import { Field, Form } from 'react-final-form';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Button } from '@mui/material';

import { getEntity } from '#c/functions';
import { fPrice, NormalizeNumber } from '@/helpers';
import Loading from '@/components/common/Loading';

const Items = [
  { key: 'currency', label: 'نرخ ارز' },
  { key: 'rial', label: 'ارزش ریالی' },
  { key: 'focCurrency', label: 'نرخ ارز کرایه' },
  { key: 'focValue', label: 'کرایه ریالی' },
  { key: 'insurance', label: 'بیمه' },
  { key: 'sif', label: 'سیف' },
  { key: 'hs', label: 'ماخذ' },
  { key: 'helal', label: 'هلال احمر' },
  { key: 'pas', label: 'پس ماند' },
  { key: 'tax', label: '6٪ مالیات' },
  { key: 'taxOff', label: 'تخفیف 6٪ مالیات' },
  { key: 'avarez', label: '3٪ عوارض' },
  { key: 'avarezOff', label: 'تخفیف 3٪ عوارض' },
  { key: 'total', label: 'جمع کل' },
];

const DefaultValues = {
  // نرخ ارز
  currency: 0,
  // ارزش ریالی
  rial: 0,
  // نرخ ارز کرایه
  focCurrency: 0,
  // کرایه ریالی
  focValue: 0,
  // بیمه
  insurance: 0,
  // سیف
  sif: 0,
  // ماخذ
  hs: 0,
  // هلال احمر
  helal: 0,
  // پس ماند
  pas: 0,
  // مالیات
  tax: 0,
  // تخفیف 6٪ مالیات
  taxOff: 0,
  // عوارض
  avarez: 0,
  // تخفیف 3٪ عوارض
  avarezOff: 0,
  // جمع کل
  total: 0,
};

export default function PaymentCalc() {
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);

  const [state, setState] = useState(DefaultValues);

  const onSubmit = async (formValues) => {
    const v = {
      value: 0,
      currency: 0,
      focValue: 0,
      focCurrency: 0,
      hsPercent: 0,
      insurance: 0,
    };

    // normalize numbers to english letters
    for (let [key, value] of Object.entries(formValues)) {
      v[key] = NormalizeNumber(value);
    }

    const { value, currency, focValue, focCurrency, hsPercent } = v;

    const rial = value * currency;
    const foc = focValue * focCurrency;
    const insurance =
      Number(v.insurance) > 0 ? v.insurance : (rial + foc) * 0.005;
    const sif = rial + foc + insurance;
    const hs = (hsPercent / 100) * sif;
    const helal = hs * 0.01;
    const pas = formValues.includePasmand ? sif / 2000 : 0;
    const tax = (sif + hs) * 0.06;
    const taxOff = formValues.taxOff ? tax * -1 : 0;
    const avarez = (sif + hs) * 0.03;
    const avarezOff = formValues.avarezOff ? avarez * -1 : 0;

    const total = hs + helal + tax + taxOff + avarez + avarezOff + pas;

    setState({
      currency,
      rial,
      focCurrency,
      focValue: foc,
      insurance,
      sif,
      hs,
      helal,
      pas,
      tax,
      taxOff,
      avarez,
      avarezOff,
      total,
    });
  };

  useEffect(() => {
    getEntity('settings', 'get-exchange-rate')
      .then((res) => {
        const r = res.items;
        let temp = r
          .filter((i) => i.currency !== 'اقلام مبادلاتی')
          // change ' 285,000 [ 0 ] ' to 285000
          .map((i) => {
            let p = i.price;
            p = p.toString().trim();
            p = p.split(/\s+/);
            p = parseInt(p.toString().replace(/,/g, ''));
            i.price = p;

            return i;
          });

        setTracks(temp);
      })
      .finally(() => setLoading(false));
  }, []);
  //

  return loading ? (
    <Loading />
  ) : (
    tracks && (
      <Form
        onSubmit={onSubmit}
        initialValues={{
          value: '',
          currency: null,
          focValue: '',
          focCurrency: null,
          hsPercent: '',
          insurance: '',
          includePasmand: true,
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form, values }) => (
          <form onSubmit={handleSubmit} className="container">
            <Row>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <label htmlFor="value">ارزش کالا</label>
                <Field
                  name="value"
                  component="input"
                  type="number"
                  min={0}
                  step={0.01}
                  required
                  className="form-control text-center ltr"
                />
              </Col>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <label htmlFor="currency">نرخ ارز</label>
                <Field
                  name="currency"
                  component="select"
                  required
                  type="select"
                  className="form-control text-center">
                  <option>انتخاب کنید</option>
                  {tracks.map((ch, c) => (
                    <option key={c} value={ch.price}>
                      {ch.currency}
                    </option>
                  ))}
                </Field>
              </Col>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <label htmlFor="focValue">کرایه</label>
                <Field
                  name="focValue"
                  component="input"
                  type="number"
                  min={0}
                  step={0.01}
                  required
                  allowNull
                  className="form-control text-center ltr"
                />
              </Col>

              <Col className="mb-3" sm={12} md={6} lg={4}>
                <label htmlFor="focCurrency">نرخ ارز کرایه</label>
                <Field
                  name="focCurrency"
                  component="select"
                  required
                  type="select"
                  className="form-control text-center">
                  <option>انتخاب کنید</option>
                  {tracks.map((ch, c) => (
                    <option key={c} value={ch.price}>
                      {ch.currency}
                    </option>
                  ))}
                </Field>
              </Col>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <label htmlFor="hsPercent">ماخذ (%)</label>
                <Field
                  name="hsPercent"
                  component="input"
                  type="number"
                  min={0}
                  step={0.01}
                  required
                  className="form-control text-center ltr"
                />
              </Col>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <label htmlFor="insurance">بیمه (اختیاری)</label>
                <Field
                  name="insurance"
                  component="input"
                  type="number"
                  min={0}
                  step={0.01}
                  className="form-control text-center ltr"
                />
              </Col>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <Field
                  onChange={(e) =>
                    form.mutators.setValue('includePasmand', e.target.checked)
                  }
                  checked={values.includePasmand}
                  name="includePasmand"
                  component={FormCheckbox}>
                  محاسبه پس ماند
                </Field>
              </Col>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <Field
                  onChange={(e) =>
                    form.mutators.setValue('taxOff', e.target.checked)
                  }
                  checked={values.taxOff}
                  name="taxOff"
                  component={FormCheckbox}>
                  تخفیف 6٪ مالیات
                </Field>
              </Col>
              <Col className="mb-3" sm={12} md={6} lg={4}>
                <Field
                  onChange={(e) =>
                    form.mutators.setValue('avarezOff', e.target.checked)
                  }
                  checked={values.avarezOff}
                  name="avarezOff"
                  component={FormCheckbox}>
                  تخفیف 3٪ عوارض
                </Field>
              </Col>
              <Col className="mb-3" sm={12}>
                <Button type="submit" variant="contained" size="large">
                  محاسبه
                </Button>
                <Button
                  className="mr-2"
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    form.reset();
                    setState(DefaultValues);
                  }}
                  startIcon={<RestartAltIcon />}>
                  بازنشانی
                </Button>
              </Col>
            </Row>
            <div className="response-flex">
              {Items.map((i, idx) => {
                const value = state[i.key];
                if (!value) return '';
                return (
                  <div key={idx}>
                    <span>{i.label}:</span>
                    <span dir="ltr">{fPrice(Math.floor(state[i.key]))}</span>
                  </div>
                );
              })}
            </div>
          </form>
        )}
      />
    )
  );
}
