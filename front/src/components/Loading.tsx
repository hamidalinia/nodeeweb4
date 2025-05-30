import { styled, CircularProgress } from '@mui/material';

const StyledLoading = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200,
}));

interface Props {
  loadingClass?: string;
  size?: number;
}

export default function Loading({ loadingClass, size = 50 }: Props) {
  return (
    <StyledLoading className={loadingClass}>
      <CircularProgress size={size} />
    </StyledLoading>
  );
}
