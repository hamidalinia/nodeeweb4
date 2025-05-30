// import { lazy, Suspense } from 'react';
import * as Icons from '@mui/icons-material';

interface LazyMuiIconProps {
  name: string;
}

// export default function LazyMuiIcon({ name }: LazyMuiIconProps) {
//   const IconElement = lazy(() => import(`@mui/icons-material/esm/${name}`));

//   return (
//     <Suspense fallback={null}>
//       <IconElement />
//     </Suspense>
//   );
// }

export default function LazyMuiIcon({ name }: LazyMuiIconProps) {
  let Icon = Icons[name];

  return Icon ? <Icon /> : null;
}
