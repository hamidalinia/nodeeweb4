import _truncate from 'lodash/truncate';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

import { relativeDate } from '@/functions/dateHelpers';
import { parseData } from '@/views/Add';

import { Card, Content, Image, CategoryTag, Row } from './components';

interface IAdCategory {
  _id: string;
  slug: string;
  name: {
    fa: string;
  };
}

interface Props {
  item: {
    active: boolean;
    title: {
      fa: string;
    };
    description: {
      fa: string;
    };
    adNumber: number;
    slug: string;

    adscategory: Array<IAdCategory>;

    photos: Array<{}>;

    updatedAt: string;
    _id: string;
  };
}

export default function AdsCard({ item }: Props) {
  const { t } = useTranslation();

  const DATA = useMemo(() => parseData(item), [item]);

  return (
    <Card>
      <Image>
        <img
          alt={DATA.title}
          loading="lazy"
          src={DATA.mainImage}
          style={{ objectFit: 'cover' }}
        />
      </Image>

      <Content>
        <Link to={DATA.url}>
          <Typography variant="h5" component="h3">
            {_truncate(DATA.title, { length: 50 })}
          </Typography>
        </Link>

        <Typography>{_truncate(DATA.description, { length: 80 })}</Typography>
        <Row>
          {DATA.mainCat && <CategoryTag>{DATA.mainCat?.name?.fa}</CategoryTag>}

          <Typography variant="body2" component="span">
            {relativeDate(DATA.date, t)}
          </Typography>
        </Row>
      </Content>
    </Card>
  );
}
