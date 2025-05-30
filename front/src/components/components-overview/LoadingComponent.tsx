import { CircularProgress, CircularProgressProps } from '@mui/material';

type Props = Omit<CircularProgressProps, 'color'> & {
  color?: React.CSSProperties['color'];
};

export default function LoadingComponent({
  color = '#3d5070',
  style,
  ...rest
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      <CircularProgress size={40} thickness={4} sx={{ color }} {...rest} />
    </div>
  );
}
