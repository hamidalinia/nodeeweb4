import { ShowImageField } from '@/components';

export default function TheImages({
  gallery,
  v,
  onImageClick,
  deleteFromObject,
}) {
  return (
    <div className="galley">
      {gallery?.map((i, idx) => (
        <ShowImageField
          key={idx}
          photo={i}
          onImageClick={() => onImageClick(i)}
          deleteFromObject={() => deleteFromObject(i, idx)}
          isActive={v === i}
        />
      ))}
    </div>
  );
}
