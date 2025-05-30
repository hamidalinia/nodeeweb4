import { useCallback, useEffect, useState } from 'react';
import { Link, useDataProvider, useShowContext, useTranslate } from 'react-admin';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { dateFormat } from '@/functions';

export default function Orders() {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { record } = useShowContext();

  const { _id } = record;
  const [state, setState] = useState({
    orders: [],
  });

  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  const fetchOrders = useCallback(
    (id) => {
      dataProvider.get('order/0/10000?customer=' + id, {}).then(({ data }) => {
        setState((state) => ({
          ...state,
          orders: data,
        }));
      });
    },
    [dataProvider]
  );
  useEffect(() => {
    fetchOrders(_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const { orders } = state;

  if (!orders) return <></>;

  return (
    <TableContainer component={Paper}>
      <div className={'label-top-table'}>{translate('orders')}</div>
      <Table sx={{ maxWidth: '100%', marginBottom: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell>{translate('resources.order._id')}</TableCell>
            <TableCell align="right">
              {translate('resources.order.sum')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.order.amount')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.order.orderNumber')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.order.status')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.order.paymentStatus')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.order.updatedAt')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.order.createdAt')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders.map((item, i) => {
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {JSON.stringify(item._id)}
                  </TableCell>
                  <TableCell>
                    {(item.sum &&
                      item.sum
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) +
                      ' ' +
                      translate(themeData.currency)}
                  </TableCell>
                  <TableCell>
                    {(item.amount &&
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) +
                      ' ' +
                      translate(themeData.currency)}
                  </TableCell>
                  <TableCell>
                    <Link to={`/order/${item._id}`}>{item.orderNumber}</Link>
                  </TableCell>
                  <TableCell>
                    <Chip
                      resource="status"
                      className={item.status}
                      label={translate('pos.OrderStatus.' + item.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      resource="paymentStatus"
                      className={item.paymentStatus}
                      label={translate(
                        'pos.OrderPaymentStatus.' + item.paymentStatus
                      )}
                    />
                  </TableCell>
                  <TableCell>{dateFormat(item.updatedAt)}</TableCell>
                  <TableCell>{dateFormat(item.createdAt)}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
