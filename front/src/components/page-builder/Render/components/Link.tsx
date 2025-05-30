import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';

function isExternalLink(url: string) {
  if (typeof window === 'undefined') return false;
  if (!url) return false;

  if (
    ['https://', 'http://', 'tel:', 'mail:', 'sms:'].some((i) =>
      url.startsWith(i)
    )
  )
    return true;

  const tmp = document.createElement('a');
  tmp.href = url;
  return tmp.host !== window.location.host;
}

interface Props {
  url: string;
  classes?: string;
  showInMobile?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export default function Link({
  url = '',
  classes = '',
  showInMobile,
  children,
  ...rest
}: Props) {
  const isExtLink = isExternalLink(url);

  const cls = clsx(
    'the-link',
    'with-out-http',
    classes,
    showInMobile && 'showInMobile'
  );

  return isExtLink ? (
    <a
      href={url}
      className={cls}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}>
      {children}
    </a>
  ) : (
    <RouterLink to={url} className={cls} {...rest}>
      {children}
    </RouterLink>
  );
}
