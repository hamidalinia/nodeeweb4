import {setStyles} from '@/functions';

export default function Header({element}) {
  let {type, components, classes, settings} = element;
  let {general} = settings;
  let {fields} = general;

  let {text} = fields;

  let style = setStyles(fields);
  if (element == 'h1') {
    return <h1 style={style}>{text}</h1>;

  }

  if (element == 'h2') {
    return <h2 style={style}>{text}</h2>;

  }
  if (element == 'h3') {
    return <h3 style={style}>{text}</h3>;

  }
  if (element == 'h4') {
    return <h3 style={style}>{text}</h3>;

  }
  if (element == 'h5') {
    return <h5 style={style}>{text}</h5>;

  }
  if (element == 'h6') {
    return <h6 style={style}>{text}</h6>;

  }
  return <h2 style={style}>{text}</h2>;
}
