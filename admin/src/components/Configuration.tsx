import { useDispatch } from 'react-redux';
import { Card, CardContent, Button } from '@mui/material';
import { useLocaleState, useTranslate } from 'react-admin';
import LanguageIcon from '@mui/icons-material/Language';

import { DollarPrice } from '@/components';
import { changeLocale } from '@/functions';

const Locales = ['en', 'fa'];

export default function Configuration() {
  const translate = useTranslate();
  const [locale, setLocale] = useLocaleState();
  const dispatch = useDispatch();

  return (
    <Card>
      {/* <Title title={translate('pos.configuration')}/> */}
      <CardContent>
        {/*<div className={classes.label}>{translate('pos.language')}</div>*/}
        {Locales.map((i, idx) => (
          <Button
            key={idx}
            variant={locale === i ? 'contained' : 'outlined'}
            className="lang-button"
            onClick={() => {
              setLocale(i);
              dispatch(changeLocale(i));
            }}>
            {i}
          </Button>
        ))}

        <LanguageIcon />

        <DollarPrice />
      </CardContent>
    </Card>
  );
}
