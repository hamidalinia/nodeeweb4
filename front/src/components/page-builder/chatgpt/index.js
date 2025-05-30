import { useCallback, useEffect } from 'react';

import { isDev } from '@/helpers';

export default function Chatgpt(props) {
  const makeHumanChatEnable = useCallback(() => {
    let i = '9gq8kY',
      a = window,
      d = document;

    function g() {
      const g = d.createElement('script'),
        s = 'https://www.goftino.com/widget/' + i,
        l = localStorage.getItem('goftino_' + i);
      // eslint-disable-next-line no-unused-expressions
      (g.async = !0), (g.src = l ? s + '?o=' + l : s);
      d.getElementsByTagName('head')[0].appendChild(g);
    }
    'complete' === d.readyState
      ? g()
      : a.attachEvent
        ? a.attachEvent('onload', g)
        : a.addEventListener('load', g, !1);
  }, []);

  useEffect(() => {
    if (isDev) return;
    makeHumanChatEnable();
  }, [makeHumanChatEnable]);

  return null;
}
