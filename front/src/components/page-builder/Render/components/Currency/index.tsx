import {useEffect, useState} from 'react';

import {getEntity} from '@/functions';
import Loading from '@/components/common/Loading';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
export default function Currency() {
  const [DATA, setData] = useState({
    head: [],
    body: [],
    lastUpdate: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEntity('settings', 'get-exchange-rate')
      .then(({rates}) => {
        // const arr = items || [];
        // get first row as header row
        // const head = [arr[0]] || [];
        // arr.shift();
        // const body = arr || [];

        setData(rates);
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading/>
  ) : (

    <div className={'currency-wrapper'}>

      {DATA && DATA.map((i, idx) => {
        let change=parseFloat(i?.change24h).toFixed(2)
        let price=parseFloat(i?.price).toFixed(2)
        return(
        <div key={idx} className={'currency-wrap'}>
          <span>{i?.cryptoSymbol}</span>
          <span dir="ltr" className={'currency-wrap-label'}>${price}</span>
          <span dir="ltr" className={'currency-wrap-price currency-wrap-price'+(change>0 ? "-green" : "-red")}> {change>0 && <><ArrowDropUpIcon/><span>{change}</span></>}
            {change<0 && <><ArrowDropDownIcon/><span>{change}</span></>}
          </span>
        </div>
      )})}

    </div>
  );
}
