import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Button, Typography } from '@mui/material';

import { getAdd, getRelatedAdd, isClient, viewAd } from '@/functions';
import Loading from '@/components/common/Loading';
import { defaultImg } from '@/assets';
import { relativeDate } from '@/functions/dateHelpers';
import AdsCard from '@/components/Home/AdsCard';

import Gallery from './Gallery';
import {
  CategoryList,
  TimeTag,
  Card,
  Content,
  Container,
  Related,
  Description,
  Row,
  CategoryRow,
} from './components';

type ViewTypes = 'PHONE' | 'CALL';

const parseCategories = (item) => {
  const temp = [];
  const nested = (i) => {
    temp.push({
      title: _get(i, 'name.fa', ''),
      slug: i.slug,
      id: i._id,
    });

    if (i.parent) nested(i.parent);
  };

  nested(item);
  return temp.reverse();
};

export const parseData = (d) => ({
  _id: d._id,
  adNumber: d.adNumber,
  slug: d.slug,
  url: `/add/${d.slug}`,
  categories: parseCategories(_get(d, 'adscategory[0]', {})),
  mainCat: _get(d, 'adscategory[0]', {}),
  title: _get(d, 'title.fa', ''),
  description: _get(d, 'description.fa', ''),
  photos: d.photos,
  mainImage: _get(d, 'photos[0].url', defaultImg),
  thumbnail: d.thumbnail,
  viewCount: d.viewCount,
  user: {
    name: _get(d, 'customer.firstName', ''),
    family: _get(d, 'customer.lastName', ''),
    id: _get(d, 'customer._id', ''),
    phone: _get(d, 'customer.phoneNumber', ''),
  },
  date: d.updatedAt,
});

export default function AddSingle(props) {
  const { t } = useTranslation();
  const { _id: slug } = useParams();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [DATA, setData] = useState<any>({
    id: null,
    categories: [],
    photos: [],
  });
  const [related, setRelated] = useState<any>([]);

  const handleView = useCallback(
    (type: ViewTypes) => {
      if (!DATA._id) return;
      viewAd(DATA._id, type).catch((e) => {
        console.error('err on view =>');
      });
    },
    [DATA._id]
  );

  const loadData = useCallback(async (id) => {
    const data = await getAdd(id).then((d = {}) => {
      const parsedData = parseData(d);
      setData(parsedData);
      if (isClient) window.scrollTo(0, 0);
      return parsedData;
    });

    const MainCatSlug = data.mainCat.slug;
    if (!MainCatSlug) {
      setLoading(false);
      return;
    }

    getRelatedAdd(6, MainCatSlug)
      .then((d = []) => {
        // filter this ad from list
        d = d.filter((i) => i.slug !== data.slug);
        setRelated(d);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!slug) return;
    loadData(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <Loading />;

  const User = DATA.user;

  return (
    <Container>
      <Breadcrumbs sx={{ width: '100%' }}>
        <Link to="/advertises">اگهی ها</Link>
        {DATA.categories.map((i, idx) => (
          <Link to={`/advertises?adscategory_slug=${i.slug}`} key={idx}>
            {i.title}
          </Link>
        ))}
      </Breadcrumbs>
      <Card>
        <Gallery photos={DATA.photos} thumbnail={DATA.thumbnail} />

        <Content>
          <Typography variant="h5" component="h1">
            {DATA.title}
          </Typography>

          <Description>
            <Typography variant="h6" component="h2">
              توضیحات:
            </Typography>
            {DATA.description}
          </Description>

          <CategoryRow>
            <p>دسته بندی ها:</p>
            <CategoryList>
              {DATA.categories.map((i, idx) => (
                <Link to={`/advertises?adscategory_slug=${i.slug}`} key={idx}>
                  {i.title}
                </Link>
              ))}
            </CategoryList>
          </CategoryRow>

          <Row>
            <p>اگهی دهنده:</p>
            <Link to={`/advertises?user_id=${User.id}`}>
              {`${User.name} ${User.family}`}
            </Link>
          </Row>

          <Row>
            <p>تعداد مشاهده:</p>
            {DATA.viewCount}
          </Row>

          <Row>
            <p>شماره اگهی:</p> {DATA.adNumber}
          </Row>
          <Row>
            {show ? (
              <div style={{ display: 'flex' }}>
                <p>شماره تماس:</p>
                <Link
                  dir="ltr"
                  onClick={() => handleView('CALL')}
                  to={`tel:${User.phone}`}>
                  {`${User.phone}`.replace('98', '0')}
                </Link>
              </div>
            ) : (
              <Button
                sx={{
                  width: 150,
                }}
                size="large"
                variant="contained"
                color="primary"
                onClick={() => {
                  setShow((p) => {
                    if (!p) handleView('PHONE');

                    return true;
                  });
                }}>
                اطلاعات تماس
              </Button>
            )}
            <TimeTag>{relativeDate(DATA.date, t)}</TimeTag>
          </Row>
        </Content>
      </Card>
      <Related>
        <Typography gutterBottom variant="h4" component="h2">
          اگهی های مشابه
        </Typography>
        {related.map((i, idx) => (
          <AdsCard key={idx} item={i} />
        ))}
      </Related>
    </Container>
  );
}
