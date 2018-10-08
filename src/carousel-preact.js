
import { Component, h, render } from 'preact';


export class Carousel {

  static css() {
    return `
        amp-carousel {
          display: block;
          border: 1px solid black;
          height: 100px;
          position: relative;
          overflow: hidden;
        }
        amp-carousel > *, .i-amphtml-shadowed > * > * {
          display: block;
          background: red;
        }
        .i-amphtml-shadow-host > *:not(.i-amphtml-shadowed) {
          display: none;
        }`;
  }

  constructor(element) {
    this.element = element;
    this.container = document.createElement('div');
    this.container.__x = 1;
    this.shadowRoot = this.element.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this.container);

    this.component = new CarouselComponent();

    this.observer = new MutationObserver(this.render_.bind(this));
  }

  adoptedCallback() {
  }

  connectedCallback() {
    Promise.resolve().then(() => {
      this.render_();
      this.observer.observe(this.element, {childList: true});
    });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
  }

  render_() {
    const state = {};
    this.element.getAttributeNames().forEach(attr => {
      state[attr] = this.element.getAttribute(attr);
    });
    state.slides = [];
    const children = this.element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child.hasAttribute('slot')) {
        child.setAttribute('slot', String(Math.random()));
      }
      state.slides.push({
        slot: child.getAttribute('slot'),
      });
    }
    this.component.setState(state);
    render(this.component.render(), this.shadowRoot, this.container);
  }
}


class CarouselComponent extends Component {
  constructor() {
    super();
  }

  render() {
    const attrs = {
      style: `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-x: auto;
          overflow-y: hidden;
          background: green;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
        `,
    };
    const children = [];
    if (this.state.slides) {
      this.state.slides.forEach(slide => {
        children.push(h('div', {
          style: `
              margin: 0 8px;
              position: relative;
              height: 100%;
              width: 100px;
              overflow: hidden;
              display: flex;
              flex-grow: 0;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
              background: blue;
            `,
        }, h('slot', {
          name: slide.slot,
        })));
      });
    }
    return (
      h('div', attrs, children)
    );
  }
}
