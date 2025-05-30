import { useCallback, useEffect, useState } from 'react';
import { useDataProvider, useShowContext, useTranslate } from 'react-admin';
import IconButton from '@mui/material/IconButton';
import AddTaskIcon from '@mui/icons-material/AddTask';

const Tasks = () => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { record } = useShowContext();

  const { _id } = record;
  const [state, setState] = useState({
    orders: [],
  });

  const fetchOrders = useCallback(
    (id) => {
      dataProvider.get('task/0/10000?customer=' + id, {}).then(({ data }) => {
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
  // const { data,isLoading } = useListContext();
  // let loaded = Boolean(data && data.length);
  // console.log("loaded", loaded,isLoading);
  // let objs=Object.keys(orders);
  const columns = [
    { field: '_id', headerName: 'ID' },
    { field: 'orderNumber', headerName: 'orderNumber', type: 'number' },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
    },
    {
      field: 'sum',
      headerName: 'Sum',
      type: 'number',
    },
    {
      field: 'paymentStatus',
      headerName: 'paymentStatus',
    },
    {
      field: 'status',
      headerName: 'status',
    },
    {
      field: 'createdAt',
      headerName: 'createdAt',
    },
    {
      field: 'updatedAt',
      headerName: 'updatedAt',
    },
  ];
  // if (!orders) {
  //   return <></>;
  // }
  // return  <div style={{ height: 400, width: '100%' }}><DataGrid
  //   getRowId={(row) => row._id}
  //   rows={orders}
  //   columns={columns}
  //   pageSize={20}
  //   rowsPerPageOptions={[5, 20, 100]}
  // /></div>;
  return (
    <div style={{ padding: '10px' }}>
      <div className={'label-top-table'}>
        <span>{translate('tasks')}</span>
        <span>
          <IconButton aria-label="create">
            <AddTaskIcon />
          </IconButton>
        </span>
      </div>
    </div>
  );
};

export default Tasks;
