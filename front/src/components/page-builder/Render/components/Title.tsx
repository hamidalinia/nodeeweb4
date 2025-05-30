import clsx from 'clsx';
import _get from 'lodash/get';

import {setStyles} from '@/functions';
import LazyMuiIcon from '@/components/common/LazyMuiIcon';

export default function Title({element}) {
  const fields = _get(element, 'settings.general.fields', {});

  const {
    text,
    iconFont,
    direction,
    link,
    display,
    showInDesktop,
    showInMobile,
    target = '_blank',
    tag = 'p',
    classes,
  } = fields;
  let style = setStyles({...fields, direction: direction, display: display});

  const Component = tag;

  if (link) {
    if (iconFont)
      return (
        <a
          href={link}
          target={target}
          style={style}
          className={clsx(
            classes,
            showInDesktop && 'showInDesktop',
            showInMobile && 'showInMobile'
          )}>
          {iconFont ? <span>{<LazyMuiIcon name={iconFont}/>}</span> : null}
          <span dangerouslySetInnerHTML={{__html: text}}/>

        </a>)

    return (
      <a
        href={link}
        target={target}
        style={style}
        dangerouslySetInnerHTML={{__html: text}}
        className={clsx(
          classes,
          showInDesktop && 'showInDesktop',
          showInMobile && 'showInMobile'
        )}>
      </a>
    );

  }
  if (iconFont)
    return (
      <Component
        style={style}
        className={clsx(
          classes,
          showInDesktop && 'showInDesktop',
          showInMobile && 'showInMobile'
        )}>
        <span>{<LazyMuiIcon name={iconFont}/>}</span>
        <span dangerouslySetInnerHTML={{__html: text}}/>
      </Component>
    );
  else
    return (
      <Component
        style={style}
        dangerouslySetInnerHTML={{__html: text}}
        className={clsx(
          classes,
          showInDesktop && 'showInDesktop',
          showInMobile && 'showInMobile'
        )}>
      </Component>
    );
}
