import { useSelector } from 'react-redux';

import { toggleCardbar,setStyles } from '#c/functions';

import Render from './Render';

export default function PageBuilder(props) {
  const {
    elements,
    content,
    style = {},
    kind = 'container-fluid',
    maxWidth = '100%',
    margin = false,
    padding = false,
    data,
    description = null,
    params,
  } = props;
  // let html = elements.html;
  // if (elements && elements.pages && elements.pages[0] && elements.pages[0].frames && elements.pages[0].frames[0] && elements.pages[0].frames[0].component && elements.pages[0].frames[0].component.components)
  //     elements = elements.pages[0].frames[0].component.components;

  const cardVisible = useSelector((st) => !!st.store.cardVisible);
  let card = useSelector((st) => st.store.card || []);
  // let menu = useSelector((st) => st.store.menuVisible);

  const handleTheCard = () => {
    toggleCardbar(cardVisible);
  };
  let elemStyle = setStyles({ ...style });

  if (maxWidth) elemStyle['maxWidth'] = maxWidth;
  if (margin) elemStyle['margin'] = margin;
  if (padding) elemStyle['padding'] = padding;

  console.log(elements);

  /**
   * Finds variable names in a given string.
   *
   * @param {string} str - The string to search for variable names.
   * @returns {string[]} An array of variable names found in the string.
   */
  function findVariableNames(str) {
    const regex = /%([^%]+)%/g;
    const matches = str.match(regex);
    if (matches) {
      return matches.map((match) => match.slice(1, -1));
    }
    return [];
  }

  console.log('elements are ', elements);

  return (
    <div className={kind} style={elemStyle}>
      {/*<div*/}
      {/*dangerouslySetInnerHTML={{__html: html}}*/}
      {/*/>*/}
      {/*{JSON.stringify(params)}*/}
      {description && description.fa && (
        <div className={kind}>
          <div className={'pt-5'} id={'description'}>
            {description && description.fa && (
              <div
                className="d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
                dangerouslySetInnerHTML={{
                  __html: description.fa ? description.fa : description,
                }}
              />
            )}
            {description && description.fa && description.fa.rendered && (
              <div
                className="d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
                dangerouslySetInnerHTML={{ __html: description.fa.rendered }}
              />
            )}
          </div>
        </div>
      )}
      {elements &&
        elements.map((element, index) => {
          // console.log('#' + index + ' element', element)
          element.handleCard = () => {
            // console.log('handleCard')
            handleTheCard();
          };
          element.card = card;
          // element.data = data;
          return (
            <Render
              content={content}
              key={index}
              element={element}
              params={params}
            />
          );
        })}
    </div>
  );
}
