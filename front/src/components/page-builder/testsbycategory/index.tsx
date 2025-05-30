import { useCallback, useEffect, useState, lazy } from 'react';
import { Col, Row } from 'shards-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Meta } from 'react-head';

import { NormalizeString } from '@/helpers';
import EmptyList from '@/components/common/EmptyList';
import Loading from '@/components/common/Loading';
import { getTestsByCategory, isClient } from '@/functions';

const TestCard = lazy(() => import('@/components/Home/TestCard'));

const NoOp = () => {};

export const Headers = ({ entity }) => {
  if (entity === 'item') return <Meta name="robots" content="noindex,nofollow" />;
};

export default function TestsByCategory(props) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tracks, setTracks] = useState([]);
  const [counts, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { element = {}, params = {} } = props;
  const { settings = {} } = element;
  const { general = {} } = settings;
  const { fields = {} } = general;
  const { entity = 'test', customQuery, populateQuery, _id } = fields;

  const defaultLimit = Number(fields.limit) || 25;
  const limit = Number(searchParams.get('limit')) || defaultLimit;
  const offset = Number(searchParams.get('offset')) || 0;

  useEffect(() => {
    if (isClient) {
      loadProductItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams, defaultLimit]);

  const loadProductItems = useCallback((filter = {}) => {
    setTracks([]);
    setLoading(true);
    let query = buildQuery(filter);

    getTestsByCategory('test', offset, limit, false, JSON.stringify(query), JSON.stringify(populateQuery))
      .then(({ items, count }) => {
        setTracks(items);
        setCount(count);
      })
      .finally(() => setLoading(false));
  }, [offset, limit, customQuery, populateQuery]);

  const buildQuery = (filter) => {
    let query = {};

    if (customQuery) {
      const parsedCustomQuery = typeof customQuery === 'string' ? JSON.parse(customQuery) : customQuery;

      Object.keys(parsedCustomQuery).forEach((item) => {
        let value = parsedCustomQuery[item];

        if (params._id) {
          value = replaceParams(value, params._id);
        }

        query[item] = parseValue(value);
      });
    }

    for (const [key, value] of searchParams) {
      query[key] = NormalizeString(value);
    }

    if (_id) query['category'] = _id;

    return query;
  };

  const replaceParams = (value, paramId) => {
    const strParamId = JSON.stringify(paramId);
    return value.replace(/'params._id'|params._id|\"params._id\"/g, strParamId);
  };

  const parseValue = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return value.replaceAll(/\"/g, '');
    }
  };

  const handleChangePage = (event, newPage) => {
    if (isClient) {
      window.scrollTo(0, 0);

      setSearchParams((p) => {
        p.set('offset', String(newPage * limit));
        return p;
      });

      loadProductItems();
    }
  };

  const handleChangeRowsPerPage = (event, obj) => {
    const newLimit = parseInt(obj.props.children);

    setSearchParams((p) => {
      p.set('limit', String(newLimit));
      p.set('offset', '0');
      return p;
    });

    loadProductItems();
  };

  if (loading) return <Loading />;

  return (
    <>
      {tracks.length ? (
        tracks.map((i, idx) => (
          <Col key={idx} lg="12" md="12" sm="12" xs="12" className="post-style-grid">
            <Headers entity={entity} />
            {entity === 'test' && <TestCard item={i} onClick={NoOp} />}
          </Col>
        ))
      ) : (
        <EmptyList />
      )}
    </>
  );
}
