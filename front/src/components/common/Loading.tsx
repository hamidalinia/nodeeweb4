import { useTranslation } from 'react-i18next';
import { styled, CircularProgress } from '@mui/material';

const StyledLoading = styled('div')(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  fontSize: 19,
  color: '#5a6169',
  '& > span': {
    color: 'rgb(68, 166, 186)',
    marginTop: theme.spacing(3),
  },
}));

interface Props {
  className?: string;
}

export default function Loading({ className }: Props) {
  const { t } = useTranslation();
  return (
    <StyledLoading className={className}>
      {/*{t('loading...')}*/}
      <CircularProgress size={40} thickness={4} />
    </StyledLoading>
  );
}
