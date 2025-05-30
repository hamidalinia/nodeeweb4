import { useEffect, useState } from 'react';
import { SplideSlide, SplideTrack } from '@splidejs/react-splide';
import { AddRounded, ChevronRightRounded } from '@mui/icons-material';

import Loading from '@/components/common/Loading';
import { getLatestAds, isClient } from '@/functions';

import { AddButton, Container, Slider } from './components';
import Card from './Card';

export default function AdBanner(props) {
  const [DATA, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;

    getLatestAds(6)
      .then((d = []) => {
        setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <Container>
        <Slider
          hasTrack={false}
          options={{
            arrows: true,
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
            pagination: false,
            direction: 'rtl',
            type: 'loop',
          }}>
          <div className="splide__arrows">
            <button className="splide__arrow splide__arrow--prev">
              <ChevronRightRounded />
            </button>
            <button className="splide__arrow splide__arrow--next">
              <ChevronRightRounded />
            </button>
          </div>
          <SplideTrack>
            {DATA.map((i, idx) => (
              <SplideSlide key={idx}>
                <Card item={i} />
              </SplideSlide>
            ))}
          </SplideTrack>
        </Slider>

        <AddButton to="/add-advertise">
          <AddRounded />
        </AddButton>
      </Container>
    </div>
  );
}
