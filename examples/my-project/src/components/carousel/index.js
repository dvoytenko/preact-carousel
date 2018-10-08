import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Carousel = (props, state) => (
  <amp-carousel>
    {props.children}
  </amp-carousel>
);

// slides-per-view={1}

export default Carousel;
