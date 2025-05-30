import {useTranslation} from 'react-i18next';
import _truncate from 'lodash/truncate';
import {Link} from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import {MainUrl} from '@/functions';
import {defaultImg} from '@/assets';
import {relativeDate} from '@/functions/dateHelpers';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
const StarRating = ({ passed,customerScore, totalScore }) => {
  // Calculate the percentage score
  const stars = [];

  if(!passed){

    for (let i = 0; i < 5; i++) {
      stars.push(<StarBorderIcon key={`full-${i}`} className="empty-star"/>);
    }
    return <span className="tc-st">{stars}</span>;

  }
  const percentage = (customerScore / totalScore) * 100;

  // Calculate the number of full, half, and empty stars
  const fullStars = Math.floor((percentage / 100) * 5); // Full stars
  const halfStars = percentage % 20 >= 10 ? 1 : 0; // Half star if the remainder of the percentage is greater than or equal to 10
  const emptyStars = 5 - fullStars - halfStars; // Empty stars are the remaining stars

  // Generate the stars

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} className="active-star" />);
  }

  // Add half star
  for (let i = 0; i < halfStars; i++) {
    stars.push(<StarHalfIcon key={`half-${i}`} className="active-star"/>);
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarBorderIcon key={`empty-${i}`} className="empty-star"/>);
  }

  return <span className="tc-st">{stars}</span>;
};
export default function TestCard({onClick, item}) {


  const {t} = useTranslation();
  let date = relativeDate(item.updatedAt, t);

  let backgroundImage = defaultImg;
  if (item.photos && item.photos[0])
    backgroundImage = MainUrl + '/' + item.photos[0];
  if (item.thumbnail) backgroundImage = MainUrl + '/' + item.thumbnail;
  const url =
    item && item.slug
      ? encodeURIComponent(item.slug.replace(/\\|\//g, ''))
      : item && typeof item.slug === 'string'
      ? item.slug
      : '';
  const title =
    item && item.title && item.title.fa
      ? item.title.fa
      : item && item.title && !item.title.fa
      ? item.title
      : '';
  const header =
    (item && item.category && item.category.name && item.category.name.fa) ? item.category.name.fa : ''
  const level = item?.sort
  const passable = item?.passable
  const practiceText = item?.practiceText
  const passed = item?.passed
  const photos = item?.photos
  const customerScore = item?.customerScore
  const score = item?.score

  return (
    <div className="col kid-test-wrapper">
      <span className={'kid-level'}>{level}</span>

      <Link to={'/test/' + url + '/'} className="col kid-button2">
        <h2>{header}<span className={'test-category-practiceText'}>{_truncate(practiceText, {length: 120})}</span></h2>

        <p className={'test-category-level'}> <StarRating passed={passed} customerScore={customerScore} totalScore={score} />
          <span className={'tc-sc'}>Score:<span>{customerScore}</span></span></p>
        {(passable && (photos && photos[0])) && <img className={'tc-st-img'} src={MainUrl+'/'+photos[0]}/>}
        {(!passable) && <LockIcon className={'tc-st-img'}/>}
      </Link>

      <div className="wer textAlignLeft"></div>
      {!passable && <div className="ghofl"></div>}

    </div>
  );
}
