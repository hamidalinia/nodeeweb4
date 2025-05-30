import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';

import { BASE_URL } from '@/functions/API';

export default (props) => {
  const {
    photo,
    isActive,
    onImageClick,
    deleteFromObject,
    className = '',
    deleteFunction = true,
  } = props;

  return (
    <div className={clsx(className, 'hytrdf', isActive ? 'active' : '')}>
      <img
        alt="img"
        loading="lazy"
        onClick={() => onImageClick && onImageClick()}
        src={`${BASE_URL}/${photo}`}
      />
      <div className="d-flex">
        <div className="bottom-actions">
          {deleteFunction && (
            <Button onClick={() => deleteFromObject()}>
              <DeleteIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
