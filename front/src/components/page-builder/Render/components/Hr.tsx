import clsx from 'clsx';

import { setStyles } from '@/functions';

export default function Hr({ element }) {
  let { type, components, classes, settings, handleCard, card } = element;
  let { general } = settings;
  let { fields } = general;
  let { text, iconFont, action, classess, showInDesktop, showInMobile } =
    fields;
  let style = setStyles(fields);
  // return JSON.stringify(style)
  return (
    <hr
      className={clsx(
        classess,
        classes,
        showInDesktop && 'showInDesktop',
        showInMobile && 'showInMobile'
      )}
      style={style}
    />
  );
}
