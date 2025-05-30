import { Fragment, useState, useRef } from 'react';
import { Field, Form } from 'react-final-form';
import { Col } from 'shards-react';
import AddIcon from '@mui/icons-material/Add';
import { Typography, Button, Box } from '@mui/material';
import generatePDF, { Margin, Options } from 'react-to-pdf';

import Loading from '@/components/common/Loading';

import MyPdf from './PDF';

const EmptyItem = {
  item: '',
  description: '',
  qty: '',
  net: '',
  gross: '',
};

const PDF_Options: Options = {
  filename: 'packing.pdf',
  method: 'save',
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: 5,
  page: {
    margin: Margin.MEDIUM,
    format: 'a4',
    orientation: 'portrait',
  },
  canvas: {
    mimeType: 'image/jpeg',
    qualityRatio: 1,
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break,
  // so use with caution.
  overrides: {
    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
    pdf: {
      orientation: 'p',
      compress: true,
      putOnlyUsedFonts: true,
    },
    // see https://html2canvas.hertzen.com/configuration for more options
    canvas: {
      useCORS: true,
      windowWidth: 30000,
      windowHeight: 30000,
    },
  },
};

const initialValues = {
  hs_code: '',
  seller: '',
  consignee: '',
  packing_no: '',
  date: '',
  transport_by: '',
  origin: '',
  items: [EmptyItem],
};

export default function Packing() {
  const targetRef = useRef<HTMLDivElement>();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (v: any) => {
    setFormData(v);
    setPreview(true);
  };

  const handleSave = () => {
    setLoading(true);
    generatePDF(targetRef, PDF_Options).finally(() => setLoading(false));
  };

  return (
    <div className="main-content-container">
      {loading && <Loading />}
      {preview && (
        <div>
          <Typography variant="h4" gutterBottom>
            پیش نمایش
          </Typography>

          <MyPdf DATA={formData} ref={targetRef} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              marginTop: 3,
              '& button': {
                minWidth: 100,
              },
            }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setPreview(false)}>
              بازگشت
            </Button>
            <Button variant="contained" size="large" onClick={handleSave}>
              ‌ذخیره
            </Button>
          </Box>
        </div>
      )}
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        mutators={{
          // expect (field, value) args from the mutator
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, values, form }) => (
          <form
            onSubmit={handleSubmit}
            className="row"
            style={{ display: preview || loading ? 'none' : 'flex' }}>
            <Col lg={6} sm={12} className="mb-3">
              <label htmlFor="hs_code">HS Code</label>
              <Field
                name="hs_code"
                component="input"
                type="number"
                required
                min={0}
                placeholder="کد تعرفه"
                className="form-control"
              />
            </Col>

            <Col lg={6} sm={12} className="mb-3">
              <label htmlFor="seller">Seller</label>
              <Field
                name="seller"
                component="input"
                required
                className="form-control"
              />
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <label htmlFor="consignee">CONSIGNEE</label>
              <Field
                name="consignee"
                component="input"
                required
                className="form-control"
              />
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <label htmlFor="packing_no">Packing NO</label>
              <Field
                name="packing_no"
                component="input"
                required
                type="number"
                min={0}
                placeholder="شماره پکینگ"
                className="form-control"
              />
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <label htmlFor="date">Date</label>
              <Field
                name="date"
                component="input"
                required
                type="date"
                placeholder="تاریخ"
                className="form-control text-center ltr"
              />
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <label htmlFor="transport_by">Transport By</label>
              <Field
                name="transport_by"
                component="select"
                required
                placeholder="حمل و نقل توسط"
                className="form-control">
                <option value="">انتخاب کنید</option>
                <option value="AIR">AIR</option>
                <option value="LAND">LAND</option>
                <option value="SEA">SEA</option>
              </Field>
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <label htmlFor="origin">Country Of Origin</label>
              <Field
                name="origin"
                component="input"
                required
                placeholder="کشور"
                className="form-control"
              />
            </Col>
            <Col lg={6} sm={12} className="mb-3" />

            {values.items.map((item, i) => (
              <Fragment key={i}>
                <Col sm={12} className="mb-3">
                  <label htmlFor={`items[${i}]["description"]`}>
                    Description
                  </label>
                  <Field
                    name={`items[${i}]["description"]`}
                    component="input"
                    required
                    placeholder="شرح کالا"
                    className="form-control"
                  />
                </Col>
                <Col lg={4} sm={12} className="mb-3">
                  <label htmlFor={`items[${i}]["qty"]`}>Quantity</label>
                  <Field
                    name={`items[${i}]["qty"]`}
                    component="input"
                    type="number"
                    required
                    step={0.01}
                    min={0}
                    placeholder="تعداد"
                    className="form-control"
                  />
                </Col>
                <Col lg={4} sm={12} className="mb-3">
                  <label htmlFor={`items[${i}]["net"]`}>Net</label>
                  <Field
                    name={`items[${i}]["net"]`}
                    component="input"
                    type="number"
                    required
                    step={0.01}
                    min={0}
                    placeholder="وزن خالص"
                    className="form-control"
                  />
                </Col>
                <Col lg={4} sm={12} className="mb-3">
                  <label htmlFor={`items[${i}]["gross"]`}>Gross</label>
                  <Field
                    name={`items[${i}]["gross"]`}
                    component="input"
                    type="number"
                    required
                    step={0.01}
                    min={0}
                    placeholder="وزن ناخالص"
                    className="form-control"
                  />
                </Col>
              </Fragment>
            ))}
            <Col sm={12} className="mb-3">
              <Button
                endIcon={<AddIcon />}
                onClick={() =>
                  form.mutators.setValue('items', [...values.items, EmptyItem])
                }
                variant="outlined">
                افزودن آیتم جدید
              </Button>
            </Col>

            <Col sm={12} className="mb-3">
              <Button type="submit" variant="contained" size="large">
                پیش نمایش
              </Button>
            </Col>
          </form>
        )}
      />
    </div>
  );
}
