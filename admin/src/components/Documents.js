import { useEffect, useState } from 'react';
import { useDataProvider, useShowContext, useTranslate } from 'react-admin';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

const Documents = () => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { record } = useShowContext();

  const { _id } = record;
  const [state, setState] = useState({
    orders: [],
  });

  useEffect(() => {
    dataProvider
      .get('document/0/10000?customer=' + _id, {})
      .then(({ data }) => {
        setState((state) => ({
          ...state,
          orders: data,
        }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const { orders } = state;

  return (
    <TableContainer component={Paper} style={{ padding: '10px' }}>
      <div className={'label-top-table'}>
        <span>{translate('documents')}</span>
        <span>
          <IconButton aria-label="create">
            <CreateNewFolderIcon />
          </IconButton>
        </span>
      </div>
      <Table
        sx={{ minWidth: '100%', marginBottom: '20px' }}
        aria-label="Documents">
        <TableHead>
          <TableRow>
            <TableCell align="right">
              {translate('resources.document.title')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.document.type')}
            </TableCell>
            {/*<TableCell align="right">{translate("resources.document.updatedAt")}</TableCell>*/}
            {/*<TableCell align="right">{translate("resources.document.createdAt")}</TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders.map((item, i) => {
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {JSON.stringify(item.title)}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  {/*<TableCell>{(item.amount && item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))+" "+translate(themeData.currency)}</TableCell>*/}
                  {/*<TableCell><a href={"/admin/#/order/" + item._id}>{(item.orderNumber)}</a></TableCell>*/}
                  {/*<TableCell><Chip source="status" className={item.status}*/}
                  {/*label={translate("pos.OrderStatus." + item.status)}/>*/}
                  {/*</TableCell>*/}
                  {/*<TableCell><Chip source="paymentStatus" className={item.paymentStatus}*/}
                  {/*label={translate("pos.OrderPaymentStatus." + item.paymentStatus)}/>*/}
                  {/*</TableCell>*/}
                  {/*<TableCell>{dateFormat(item.updatedAt)}</TableCell>*/}
                  {/*<TableCell>{dateFormat(item.createdAt)}</TableCell>*/}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Documents;
