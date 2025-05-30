import { Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { CheckCircleOutlineRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
}));

export default function AddAdvertiseStep5() {
  const { t } = useTranslation();
  return (
    <Container>
      <CheckCircleOutlineRounded
        sx={{
          color: 'success.light',
          fontSize: 150,
          margin: '0 auto',
        }}
      />

      <Typography variant="h5" marginY={5}>
        {t('you ads submitted successfully') + ' '}
        {t('And after review it will be shown to public')}
      </Typography>
      <Link className="text-center btn btn-outline-primary" to="/profile#myads">
        {t('my ads')}
      </Link>
    </Container>
  );
}
