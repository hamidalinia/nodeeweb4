import { useCallback, useEffect, useState } from 'react';
import { useTranslate, useDataProvider, useShowContext } from 'react-admin';
import { DataGrid } from '@mui/x-data-grid';

const Campaigns = () => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { record } = useShowContext();

  const { campaign } = record;

  const [state, setState] = useState({
      campaign: [],
  });


  useEffect(() => {
    // fetchOrders(phoneNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { field: '_id', headerName: 'ID', width: 100 },
    {
      field: 'token',
      width: 250,
      headerName: 'token',
    },
    {
      field: 'status',
      width: 100,

      headerName: 'status',
    },
  ];


  if (!campaign) return <></>;

  return (
    <div style={{ height: 400, width: '100%', minWidth: '100%' }}>
      <div className={'label-top-table'}>{translate('campaigns')}</div>
      <DataGrid
        style={{ minWidth: '100%' }}
        getRowId={(row) => row._id}
        rows={campaign}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5, 20, 100]}
        checkboxSelection={false}
        disableSelectionOnClick={true}
      />
    </div>
  );
  // return (
  //   <TableContainer component={Paper}>
  //     <div className={'label-top-table'}>{translate('notifications')}</div>
  //     <Table
  //       sx={{ minWidth: '100%', marginBottom: '20px' }}
  //       aria-label="simple table">
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>_id</TableCell>
  //           <TableCell align="right">from</TableCell>
  //           <TableCell align="right">message</TableCell>
  //           <TableCell align="right">status</TableCell>
  //           <TableCell align="right">updatedAt</TableCell>
  //           <TableCell align="right">createdAt</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {orders &&
  //           orders.map((item, i) => {
  //             return (
  //               <TableRow key={i}>
  //                 <TableCell component="th" scope="row">
  //                   {JSON.stringify(item._id)}
  //                 </TableCell>
  //                 <TableCell>{JSON.stringify(item.from)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.message)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.status)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.updatedAt)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.createdAt)}</TableCell>
  //               </TableRow>
  //             );
  //           })}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );
};

export default Campaigns;
