import { h, Component } from 'preact';
import style from './style';
import Carousel from '../../components/carousel';
// import { uuid, store } from './util';

class Home extends Component {
  constructor() {
    super();
    this.model = new Model('slides', () => this.setState({}));
    this.model.addSlide({text: 'Slide 1'});
    this.model.addSlide({text: 'Slide 2'});
    this.model.addSlide({text: 'Slide 3'});
    this._counter = 3;
  }

  handleNewSlide() {
    this._counter++;
    this.model.addSlide({text: 'Slide ' + this._counter});
  }

  handleRemoveSlide() {
    this.model.removeSlide();
  }

  handleReverse() {
    this.model.reverseSlides();
  }

  render({ }, { }) {
    let { slides } = this.model;

    return (
        <div class={style.home}>
          <h1>Home</h1>
          <p>This is the Home component?.</p>
          <Carousel>
            { slides.map( slide => (
                <div key={slide.id}>
                  {slide.text}
                  <iframe src="/assets/iframe.html?{Math.random()}" width="100" height="80"></iframe>
                </div>
              ))
            }
          </Carousel>
          <div>
            <button onClick={this.handleNewSlide.bind(this)}>
              Add a new slide
            </button>
            <button onClick={this.handleRemoveSlide.bind(this)}>
              Remove a slide
            </button>
            <button onClick={this.handleReverse.bind(this)}>
              Reverse
            </button>
          </div>
        </div>
      );
  }
}


class Model {
  constructor(key, sub) {
    this.key = key;
    this.slides = [];
    this.onChanges = [sub];
    this._counter = 0;
  }

  inform() {
    this.onChanges.forEach( cb => cb() );
  }

  addSlide({text}) {
    this._counter++;
    this.slides = this.slides.concat({
      id: String(this._counter),
      text,
    });
    this.inform();
  }

  removeSlide() {
    this.slides = this.slides.splice(1);
    this.inform();
  }

  reverseSlides() {
    this.slides = this.slides.reverse();
    this.inform();
  }
}


export default Home;
