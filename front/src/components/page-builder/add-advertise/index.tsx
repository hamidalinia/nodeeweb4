import { useState, lazy, useCallback, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';

import { submitAd } from '@/functions';
import Loading from '@/components/common/Loading';

import { Container, Content } from './components';
import Buttons from './Buttons';
import { initialValues, validationSchema } from './Form';
import Step1 from './Step1';

const Step2 = lazy(() => import('./Step2'));
const Step3 = lazy(() => import('./Step3'));
const Step4 = lazy(() => import('./Step4'));
const Step5 = lazy(() => import('./Step5'));

const LastStep = 4;

export default function AddAdvertise() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const _submitForm = useCallback(
    (v, { setSubmitting }) => {
      setLoading(true);

      const req = {
        title: v.title,
        description: v.description,
        category: v.mainCategory._id,
        photos: v.images,
      };

      submitAd(req)
        .then(() => {
          toast.success(t('you ads submitted successfully'));
          // thanks page
          setActiveStep(5);
        })
        .catch((er) => toast.error(er))
        .finally(() => {
          setSubmitting(false);
          setLoading(false);
        });
    },
    [t]
  );

  const handleNextStep = useCallback(
    async (values, form) => {
      if (activeStep < LastStep) {
        if (activeStep === 3 && values.images.length === 0) {
          toast.error(t('لطفا حداقل یک عکس انتخاب کنید'));
          return;
        }
        setActiveStep(activeStep + 1);
        form.setTouched({});
        form.setSubmitting(false);
        // last step
      } else _submitForm(values, form);
    },
    [activeStep, _submitForm]
  );

  const handlePrevStep = useCallback(() => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const _renderStepContent = useCallback((step) => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;

      default:
        return <div>404</div>;
    }
  }, []);

  return (
    <Container>
      <Content>
        <Suspense fallback={<Loading />}>
          {loading ? (
            <Loading />
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema[activeStep]}
              onSubmit={handleNextStep}>
              <Form style={{ height: '100%' }}>
                {_renderStepContent(activeStep)}

                <Buttons
                  onPrev={handlePrevStep}
                  activeStep={activeStep}
                  t={t}
                  isLastStep={activeStep === LastStep}
                />
              </Form>
            </Formik>
          )}
        </Suspense>
      </Content>
    </Container>
  );
}
