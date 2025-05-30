export default function TextNode({ element }) {
  let { content, classes } = element;
  // console.clear()
  // console.log('element', element)

  return (
    <div
      className={
        'p-node ' +
        (classes ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ') : '')
      }>
      {' '}
      {content}
    </div>
  );
  // return <div className={'the-title'}><ShowElement element={component}/></div>;
}
