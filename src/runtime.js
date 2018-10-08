/**
 * Copyright 2018 The Subscribe with Google Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import {Carousel} from './carousel';
import {Carousel} from './carousel-preact';

const RUNTIME_PROP = 'MICROK';


/**
 * @param {!Window} win
 */
export function installRuntime(win) {
  if (win[RUNTIME_PROP] && !Array.isArray(win[RUNTIME_PROP])) {
    return;
  }

  const runtime = new Runtime(win);

  const waitingArray = [].concat(win[RUNTIME_PROP]);

  const dependencyInstaller = {};

  /**
   * @param {function(!Object)} callback
   */
  function pushDependency(callback) {
    if (!callback) {
      return;
    }
    Promise.resolve().then(() => {
      callback(runtime);
    });
  }
  Object.defineProperty(dependencyInstaller, 'push', {
    get: () => pushDependency,
    configurable: false,
  });
  win[RUNTIME_PROP] = dependencyInstaller;
  if (waitingArray) {
    waitingArray.forEach(pushDependency);
  }
  runtime.start();
}


export class Runtime {
  /**
   * @param {!Window} win
   */
  constructor(win) {
    this.win = win;

    this.registerElement('amp-carousel', Carousel, Carousel.css());
  }

  registerElement(name, implementationClass, css) {
    const styles = this.win.document.createElement('style');
    styles.setAttribute('amp-ext', name);
    styles.textContent = Carousel.css();
    this.win.document.head.appendChild(styles);

    const klass = createCustomElementClass(this.win, name, implementationClass);
    this.win.document.registerElement(name, {
      prototype: klass.prototype,
    });
    /*QQQQ: doesn't work:
      "Please use the 'new' operator, this DOM object constructor cannot be called as a function"
    this.win.customElements.define(name, klass);
    */
  }

  start() {
  }
}


/**
 * Creates a named custom element class.
 *
 * @param {!Window} win The window in which to register the custom element.
 * @param {string} name The name of the custom element.
 * @return {!Function} The custom element class.
 */
function createCustomElementClass(win, name, implementationClass) {
  const baseCustomElement = createBaseCustomElementClass(win);
  /** @extends {HTMLElement} */
  class CustomAmpElement extends baseCustomElement {
    /**
     * @see https://github.com/WebReflection/document-register-element#v1-caveat
     * @suppress {checkTypes}
     * @param {HTMLElement} self
     */
    constructor(self) {
      return super(self);
    }

    implementationClass() {
      return implementationClass;
    }

    elementName() {
      return name;
    }
  }
  return CustomAmpElement;
}


/**
 * Creates a base custom element class.
 *
 * @param {!Window} win The window in which to register the custom element.
 * @return {!Function}
 */
function createBaseCustomElementClass(win) {
  if (win.BaseCustomElementClass) {
    return win.BaseCustomElementClass;
  }
  const htmlElement = win.HTMLElement;
  /** @abstract @extends {HTMLElement} */
  class BaseCustomElement extends htmlElement {
    /**
     * @see https://github.com/WebReflection/document-register-element#v1-caveat
     * @suppress {checkTypes}
     * @param {HTMLElement} self
     */
    constructor(self) {
      self = super(self);
      self.createdCallback();
      return self;
    }

    /**
     * Called when elements is created. Sets instance vars since there is no
     * constructor.
     * @final @this {!Element}
     */
    createdCallback() {
      const Ctor = this.implementationClass();
      this.impl_ = new Ctor(this);
    }

    /**
     * @abstract
     */
    implementationClass() {
    }

    /**
     * The name of the custom element.
     * @abstract
     * @return {string}
     */
    elementName() {
    }

    /**
     * Called when the element is first connected to the DOM. Calls
     * {@link firstAttachedCallback} if this is the first attachment.
     * @final @this {!Element}
     */
    connectedCallback() {
      this.impl_.connectedCallback();
    }

    /** The Custom Elements V0 sibling to `connectedCallback`. */
    attachedCallback() {
      this.connectedCallback();
    }

    /**
     * Called when the element is disconnected from the DOM.
     * @final @this {!Element}
     */
    disconnectedCallback() {
      this.impl_.disconnectedCallback();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      this.impl_.attributeChangedCallback(attrName, oldVal, newVal);
    }
  }
  win.BaseCustomElementClass = BaseCustomElement;
  return win.BaseCustomElementClass;
}
