


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
    console.log('QQQ: created: ', element);

    // this.shadow = new NativeShadow(this.element);
    this.shadow = new EmulShadow(this.element);
    this.shadow.container.style.setProperty('overflow-x', 'auto');
    this.shadow.container.style.setProperty('background', 'green');
    this.shadow.container.style.setProperty('display', 'flex');
    this.shadow.container.style.setProperty('flex-direction', 'row');
    this.shadow.container.style.setProperty('flex-wrap', 'nowrap');
  }

  adoptedCallback() {
    console.log('QQQ: adoptedCallback');
  }

  connectedCallback() {
    console.log('QQQ: connectedCallback: ', this.element.children);
    this.observer = new MutationObserver(this.mutationObserver_.bind(this));
    this.observer.observe(this.element, {childList: true});
    this.mutationObserver_([{
      addedNodes: Array.prototype.slice.call(
          nativeDescriptors.children.get.call(this.element), 0),
    }]);
  }

  disconnectedCallback() {
    console.log('QQQ: disconnectedCallback');
    this.observer.disconnect();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('QQQ: attributeChangedCallback', attrName, oldVal, newVal);
  }

  mutationObserver_(mutationsList) {
    console.log('QQQ: mutations: ', mutationsList);
    this.shadow.mutate(mutationsList);
  }
}


/** @interface */
class Shadow {

  constructor(host) {
    this.host = host;
    this.container = document.createElement('div');
    this.container.style = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-x: hidden;
      overflow-y: hidden;
    `;
  }

  mutate(mutationsList) {}
}


class NativeShadow extends Shadow {

  constructor(host) {
    super(host);
    this.shadowRoot = host.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this.container);
  }

  mutate(mutationsList) {
    mutationsList.forEach(mutation => {
      if (mutation.removedNodes && mutation.removedNodes.length > 0) {
        mutation.removedNodes.forEach(node => {
          const slotId = node.getAttribute('slot');
          if (slotId) {
            const slot = this.container.querySelector(`slot[name="${slotId}"]`);
            if (slot) {
              this.container.removeChild(slot.parentElement);
            }
          }
        });
      }
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // TODO: order?!?
        this.processChildren_(mutation.addedNodes);
      }
    });
  }

  processChildren_(nodes) {
    // TODO: contract should always be mutations -> mergeChildren or such.
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      const slide = document.createElement('div');
      slide.style = `
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
      `;
      this.container.appendChild(slide);

      const slotId = Math.random();
      const slot = document.createElement('slot');
      slot.setAttribute('name', slotId);
      slide.appendChild(slot);
      node.setAttribute('slot', slotId);
    }
  }
}


class EmulShadow extends Shadow {

  constructor(host) {
    super(host);
    host.classList.add('i-amphtml-shadow-host');
    host.__container = this.container;
    this.container.classList.add('i-amphtml-shadowed');
    this.host.appendChild(this.container);
    Object.defineProperties(host, hostEmulDescriptors);
  }

  mutate(mutationsList) {
    mutationsList.forEach(mutation => {
      /*QQQQ
      if (mutation.removedNodes && mutation.removedNodes.length > 0) {
        mutation.removedNodes.forEach(node => {
          const slotId = node.getAttribute('slot');
          if (slotId) {
            const slot = this.container.querySelector(`slot[name="${slotId}"]`);
            if (slot) {
              this.container.removeChild(slot.parentElement);
            }
          }
        });
      }
      */
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // TODO: order?!?
        this.processChildren_(mutation.addedNodes);
      }
    });
  }

  processChildren_(nodes) {
    // TODO: contract should always be mutations -> mergeChildren or such.
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node == this.container) {
        continue;
      }

      const slide = document.createElement('div');
      slide.style = `
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
      `;
      this.container.appendChild(slide);

      slide.appendChild(node);
    }
  }
}


const nativeDescriptors = {
  'className': Object.getOwnPropertyDescriptor(Element.prototype, 'className'),
  'children': Object.getOwnPropertyDescriptor(Element.prototype, 'children'),
}

const hostEmulDescriptors = {
  'className': {
    get: function() {
      const v = nativeDescriptors.className.get.call(this);
      let s = '';
      this.classList.forEach(c => {
        if (!c.startsWith('i-amphtml')) {
          s += '  ' + c;
        }
      });
      s = s.trim();
      console.log('QQQQ: get className: ', v, '->', s);
      return s;
    },
    set: function(value) {
      let set = value;
      const old = nativeDescriptors.className.get.call(this);
      let internal = '';
      this.classList.forEach(c => {
        if (c.startsWith('i-amphtml')) {
          internal += c + ' ';
        }
      });
      if (internal) {
        set = internal + value;
      }
      console.log('QQQQ: set className: ', old, '/', internal, '->', value, '/', set);
      nativeDescriptors.className.set.call(this, set);
    },
  },
  'children': {
    get: function() {
      const v = this.__container.children;
      console.log('QQQQ: get children: ', v);
      return v;
    },
  },
  'firstChild': {
    get: function() {
      const v = this.__container.firstChild;
      console.log('QQQQ: get firstChild: ', v);
      return v;
    },
  },
}
