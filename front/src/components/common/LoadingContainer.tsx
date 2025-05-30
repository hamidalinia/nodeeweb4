import { forwardRef } from 'react';
import { styled } from '@mui/material';

import Loading from './Loading';

const StyledLoading = styled(Loading)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#0006',
  zIndex: 10000,
  color: '#fff',
  borderRadius: 4,
  fontSize: 24,
}));

type Props<T> = React.HTMLAttributes<T> & {
  loading: boolean;
  loadingClass?: string;
  size?: number;
  as?: React.ElementType;
};

export default forwardRef<HTMLDivElement, Props<HTMLDivElement>>(
  function LoadingContainer(
    {
      loading = false,
      loadingClass,
      size = 50,
      children,
      className,
      as = 'div',
      ...rest
    },
    ref
  ) {
    let Component = as;

    return (
      <Component
        ref={ref}
        className={className}
        style={{ position: 'relative' }}
        {...rest}>
        {loading ? <StyledLoading className={loadingClass} /> : null}
        {children}
      </Component>
    );
  }
);
