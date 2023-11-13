import "./../styles/index.scss";
import { FeedScreen } from "./screens/FeedScreen";

class App {
  constructor({ el }) {
    this.el = el;

    this.screen = new FeedScreen({ el: this.el });

    this.start();
  }

  async start() {
    await this.screen.load();
    this.render();
  }

  render() {
    if (this.screen.render) {
      this.el.innerHTML = this.screen.render();
      this.screen.postRender();
      this.screen.setup();
      this.screen.listen();
    }
  }
}

window.$app = new App({ el: document.querySelector("#app") });
