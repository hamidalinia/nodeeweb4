import Render from '../index';

export default function Swiper({ element }) {
  let {  components, params } = element;

  if (components)
    return components.map((com, index) => (
      <Render params={params} key={index} element={com} />
    ));
}
