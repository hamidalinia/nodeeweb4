import { useCallback, useState } from 'react';
import { useDataProvider } from 'react-admin';

import { numberWithCommas } from '@/functions';

export default function DollarPrice() {
  const [state, setState] = useState({
    priceDollar: 0,
    priceDerham: 0,
  });
  // const version = useVersion();
  const dataProvider = useDataProvider();

  const fetchPriceDollar = useCallback(async () => {
    const { data: Data } = await dataProvider.get('settings/dollar', {});

    if (Data && Data.dollarPrice && Data.derhamPrice) {
      console.log(Data.dollarPrice);
      setState((state) => ({
        ...state,
        priceDollar: Data.dollarPrice,
        priceDerham: Data.derhamPrice,
      }));
    }
  }, [dataProvider]);

  // useEffect(() => {
  //     fetchPriceDollar();
  // }, [version]);

  const { priceDollar, priceDerham } = state;
  return (
    <>
      <div>
        {priceDollar !== 0 && (
          <>
            <span className={'labelofdollarPrice'}>قیمت دلار:</span>
            <span className={'dollarPrice'}>
              {numberWithCommas(priceDollar) + ' تومان'}
            </span>
          </>
        )}
      </div>
      <div>
        {priceDerham !== 0 && (
          <>
            <span className={'labelofdollarPrice'}>قیمت درهم:</span>
            <span className={'dollarPrice'}>
              {numberWithCommas(priceDerham) + ' تومان'}
            </span>
          </>
        )}
      </div>
    </>
  );
}
