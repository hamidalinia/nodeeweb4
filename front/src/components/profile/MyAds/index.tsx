import { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'shards-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';

import PageTitle from '@/components/common/PageTitle';
import { getMyAds } from '@/functions';
import { dateFormat } from '@/functions/utils';
import Loading from '@/components/common/Loading';

import ViewChart from './ViewChart';

const parseData = (arr, t) =>
  arr.map((post) => {
    if (post.createdAt) post.createdAt = dateFormat(post.createdAt);

    if (post.updatedAt) post.updatedAt = dateFormat(post.updatedAt);
    if (post && post['sum']) {
      post['sum'] =
        post['sum'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        t(' UZS');

      if (post && post['amount']) {
        post['amount'] =
          post['amount'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          t(' UZS');
      }
      if (post && post['deliveryPrice']) {
        post['deliveryPrice'] =
          post['deliveryPrice']
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + t(' UZS');
      }
      // link['kind']=t('product');
    }
    if (post && post.status) {
      switch (post.status) {
        case 'processing':
          post.status = t('waiting to review');
          post.status_cl = 'bg-warning';
          break;
        case 'published':
          post.status = t('confirmed');
          post.status_cl = 'bg-success';
          break;
        case 'complete':
          post.status = t('complete');
          post.status_cl = 'bg-success';
          break;
        case 'indoing':
          post.status = t('indoing');
          post.status_cl = 'bg-warning';
          break;
        case 'makingready':
          post.status = t('makingready');
          post.status_cl = 'bg-warning';
          break;
        case 'canceled':
          post.status = t('canceled');
          post.status_cl = 'bg-error';
          break;
        case 'trash':
          post.status = t('trash');
          post.status_cl = 'bg-error';
          break;
        case 'deleted':
          post.status = t('deleted');
          post.status_cl = 'bg-error';
          break;
        case 'inpeyk':
          post.status = t('inpeyk');
          post.status_cl = 'bg-warning';
          break;
        case 'checkout':
          post.status = t('checkout');
          post.status_cl = 'bg-warning';
          break;
        case 'cart':
          post.status = t('cart');
          post.status_cl = 'bg-warning';
          break;
        default:
          break;
      }
    }
    if (post && post.paymentStatus) {
      switch (post.paymentStatus) {
        case 'paid':
          post.paymentStatus = t('successful');
          post.paymentStatus_cl = 'bg-success';
          break;
        case 'notpaid':
          post.paymentStatus = t('not paid');
          post.paymentStatus_cl = 'bg-warning';
          break;
        case 'unsuccessful':
          post.paymentStatus = t('unsuccessful');
          post.paymentStatus_cl = 'bg-error';
          break;
        default:
          break;
      }
    }

    return post;
  });

export default function MyAds({ title }) {
  const { t } = useTranslation();
  const [DATA, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAds()
      .then((d) => {
        if (!d || !d.length) return;

        setData(parseData(d, t));
      })
      .catch((er) => toast.error(er))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="12"
          title={title}
          subtitle={t('user account')}
          className="text-sm-left"
        />
      </Row>

      <Card small className="mb-4">
        <CardBody className="p-2">
          {loading ? (
            <Loading />
          ) : (
            <Row>
              {DATA?.map((i, idx) => (
                <Col key={idx} xs={12}>
                  <div className="the-order-purple p-4 mb-3">
                    {i.adNumber && (
                      <div className="the-order-number">
                        {`${t('ad_number')}: ${i.adNumber}`}
                      </div>
                    )}

                    <Typography gutterBottom>
                      {`${t('status')} ${t('ad')}: `}
                      <span
                        className={clsx(
                          i.status_cl,
                          'text-white text-center rounded p-3 iii'
                        )}>
                        <span className="gfdsdf">{t(i.status)}</span>
                      </span>
                    </Typography>

                    <Typography gutterBottom>
                      {t('Payment Status')}:
                      <span
                        className={clsx(
                          i.paymentStatus_cl,
                          'text-white text-center rounded p-3 iii'
                        )}>
                        {' '}
                        {i.paymentStatus}
                      </span>
                    </Typography>

                    <Typography gutterBottom>
                      {`${t('title')} ${t('ad')}: `}
                      <span dir="ltr">{i.title?.fa}</span>
                    </Typography>
                    <Typography gutterBottom>
                      {`${t('create_date')}: `}
                      <span dir="ltr">{i.updatedAt}</span>
                    </Typography>

                    {i.status_cl === 'bg-success' && (
                      <>
                        <Typography gutterBottom>
                          <Link className="gfdsdf" to={'/add/' + i._id}>
                            مشاهده {t('ad')} در سایت
                            <OpenInNewIcon />
                          </Link>
                        </Typography>
                        <ViewChart id={i._id} />
                      </>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
