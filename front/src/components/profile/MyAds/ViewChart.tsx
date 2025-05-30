import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ButtonBase, Collapse, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import Loading from '@/components/Loading';
import { getAdViews } from '@/functions';
import { fDateTime } from '@/helpers/date';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data: ChartData<'line'> = {
  datasets: [
    {
      label: 'تعداد مشاهده',
      data: [],
      backgroundColor: '#297e7b',
      borderColor: 'rgba(41, 126, 123, 0.3)',
    },
  ],
};
const options: ChartOptions<'line'> = {
  responsive: true,

  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        font: { family: 'IRANSans' },
      },
    },
    y: {
      ticks: {
        precision: 0,
        font: { family: 'IRANSans' },
      },
      min: 0,
    },
  },
  plugins: {
    legend: { display: false },
    title: {
      font: { family: 'IRANSans' },
      display: true,
      text: 'تعداد مشاهده اگهی ها',
    },
    tooltip: {
      rtl: true,
      position: 'average',
      titleFont: { family: 'IRANSans' },
      bodyFont: { family: 'IRANSans' },
    },
  },
};

interface parseDataType {
  callCount: number;
  phoneCount: number;
  data: number[];
  labels: string[];
  total: number;
}

const parseData = (arr = []): parseDataType => {
  const obj: Record<string, { label: string; count: number }> = {};

  arr
    // filer views only
    .filter((i) => ['', undefined].includes(i.type))
    .forEach((i) => {
      const key = fDateTime(i.createdAt, 'YYYY-MM-DD');
      if (!obj[key])
        obj[key] = {
          label: key,
          count: 0,
        };
      else obj[key].count = obj[key].count + 1;
    });

  return {
    callCount: arr.filter((i) => i.type === 'CALL').length,
    phoneCount: arr.filter((i) => i.type === 'PHONE').length,
    data: Object.values(obj).map((i) => i.count),
    labels: Object.values(obj).map((i) => i.label),
    total: arr.length,
  };
};

function Chart({ id }) {
  const [loading, setLoading] = useState(true);
  const [DATA, setData] = useState<parseDataType>({
    callCount: 0,
    phoneCount: 0,
    labels: [],
    data: [],
    total: 0,
  });

  useEffect(() => {
    setLoading(true);
    getAdViews(id)
      .then(({ views = [] }) => {
        const parsed = parseData(views || []);
        data.datasets[0].data = parsed.data;
        data.labels = parsed.labels;
        setData(parsed);
      })
      .catch((e) => {
        data.datasets[0].data = [];
      })
      .finally(() => setLoading(false));
  }, [id]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Typography>تعداد تماس: {DATA.callCount}</Typography>
      <Typography>تعداد مشاهده شماره: {DATA.phoneCount}</Typography>
      <Typography>مجموع مشاهده: {DATA.total}</Typography>
      <Line options={options} redraw data={data} />
    </>
  );
}

export default function ViewChart({ id }) {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(!open);

  return (
    <>
      <ButtonBase onClick={handleClick} sx={{ display: 'flex', m: 'auto' }}>
        <Typography>نمودار</Typography>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ButtonBase>
      <Collapse in={open} timeout="auto" unmountOnExit mountOnEnter>
        <Chart id={id} />
      </Collapse>
    </>
  );
}
