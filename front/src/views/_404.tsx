import { Box, Typography } from '@mui/material';

export default function _404({ _x = '' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
      }}>
      <Typography variant="h3" component="h1">
        404
      </Typography>
      {_x && <div>{_x}</div>}
      <div>Not Found</div>
    </Box>
  );
}
