import autoBind from "auto-bind";
import { compile } from "handlebars";

export default class Screen {
  constructor(config = {}) {
    Object.assign(this, config);
    autoBind(this);

    if (
      typeof this.constructor.view == "string" &&
      this.constructor.view.length
    ) {
      this.compileTemplate();
    }
  }

  compileTemplate() {
    this.render = () => {
      const renderer = compile(this.constructor.view);

      return renderer(this.props);
    };
  }

  $(query) {
    const els = this.el.querySelectorAll(query);
    if (!els?.length) return null;

    return els.length > 1 ? [...els] : els[0];
  }

  async load() {
    if (this.constructor.loader) {
      const data = await this.constructor.loader();
      this.props = data;
    }
  }
  postRender() {
    if (this.constructor.els) {
      const queries = Object.entries(this.constructor.els);
      this.els = {};
      for (let [key, query] of queries) {
        this.els[key] = this.$(query);
      }
    }
  }
  setup() {}
  listen() {}
}
