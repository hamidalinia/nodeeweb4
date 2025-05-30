import { Button } from 'shards-react';
import {
  ArrowLeft,
  ArrowRight,
  PublishedWithChangesOutlined,
} from '@mui/icons-material';

import { Buttons } from './components';

export default function AddAdvertiseButtons({
  activeStep,
  isLastStep,
  onPrev,
  t,
}) {
  if (activeStep === 5) return null;

  return (
    <Buttons>
      <Button type="button" disabled={activeStep < 2} onClick={() => onPrev()}>
        <ArrowRight />
        {t('prev')}
      </Button>
      <Button type="submit">
        {isLastStep ? (
          <>
            {t('publish post')}
            <PublishedWithChangesOutlined />
          </>
        ) : (
          <>
            {t('next')}
            <ArrowLeft />
          </>
        )}
      </Button>
    </Buttons>
  );
}
