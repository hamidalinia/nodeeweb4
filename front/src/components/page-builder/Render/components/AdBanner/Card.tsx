import _truncate from 'lodash/truncate';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

import { parseData } from '@/views/Add';

import { Content } from './components';

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
  const DATA = useMemo(() => parseData(item), [item]);

  return (
    <Content>
      <Link to={DATA.url} title="مشاهده">
        <Typography variant="h6" component="h3">
          {_truncate(DATA.title, { length: 40 })}
        </Typography>
      </Link>
      {DATA.mainCat && <span>{DATA.mainCat?.name?.fa}</span>}
    </Content>
  );
}
