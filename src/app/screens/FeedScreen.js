import Screen from "../core/Screen";
import view from "@/app/views/feed.hbs?raw";
import loader from "@/app/loaders/feed";
import { gsap } from "gsap";

export class FeedScreen extends Screen {
  static view = view;
  static loader = loader;
  static els = {
    stacks: ".card-stack",
    cardGrid: ".stack",
    cardGridItems: ".stack .card",
    overlay: ".feed-overlay",
  };

  setup() {
    this.calculateGrid();
  }

  listen() {
    this.els.stacks.forEach((stack) => stack.addEventListener("click", this.onStackClick));

    this.els.cardGrid.addEventListener("click", this.onCardGridClick);
  }

  calculateGrid() {
    this.positions = this.cachePositions();
    this.convertToAbsoluteLayout();
  }

  async onStackClick(event) {
    this.currentStack = event.currentTarget;
    this.stackBounds = this.currentStack.getBoundingClientRect();
    this.cardBounds = this.cacheCurrentStackPositions();

    gsap.set(this.els.cardGrid, { opacity: 1 });
    gsap.set(this.currentStack, { opacity: 0 });
    gsap.to(this.els.overlay, { opacity: 1, duration: 0.5 });
    gsap.to(
      this.els.stacks.filter((stack) => stack != this.currentStack),
      {
        opacity: 0.5,
        duration: 0.25,
      }
    );

    const lastCardIndex = this.cardBounds.length - 1;

    gsap.set(this.els.cardGridItems, {
      onComplete: () => {
        gsap.set(this.els.cardGridItems, {
          x: (index) => {
            const { translateX } = this.cardBounds[Math.min(index, lastCardIndex)];
            return this.stackBounds.left + translateX - 20;
          },
          y: (index) => {
            const { translateY } = this.cardBounds[Math.min(index, lastCardIndex)];
            return this.stackBounds.top + translateY - 38;
          },
          rotation: (index) => this.cardBounds[Math.min(index, lastCardIndex)].rotation,
          scale: this.cardBounds[0].width / this.positions[0].width,
          zIndex: (index) => this.els.cardGridItems.length - index,
          onComplete: () => {
            gsap.to(this.currentStack, { opacity: 0 });
            gsap.to(this.els.cardGridItems, {
              x: (index) => this.positions[index].x,
              y: (index) => this.positions[index].y,
              rotation: 0,
              scale: 1,
              ease: "elastic.out(0.5, 0.4)",
              duration: 1,
              stagger: 0.05,
              onComplete: () => {
                this.els.cardGrid.classList.add("active");
              },
            });
          },
        });
      },
    });
  }

  onCardGridClick(event) {
    const backdropClick = event.target == event.currentTarget;

    if (backdropClick) {
      const lastCardIndex = this.cardBounds.length - 1;
      gsap.to(this.els.overlay, { opacity: 0 });
      gsap.to(
        this.els.stacks.filter((el) => el !== this.currentStack),
        { opacity: 1 }
      );

      gsap.to(this.els.cardGridItems, {
        rotation: (index) => this.cardBounds[Math.min(index, lastCardIndex)].rotate,
        x: (index) => {
          const { translateX } = this.cardBounds[Math.min(index, lastCardIndex)];
          return this.stackBounds.left + translateX - 20;
        },
        y: (index) => {
          const { translateY } = this.cardBounds[Math.min(index, lastCardIndex)];
          return this.stackBounds.top + translateY - 38;
        },
        scale: this.cardBounds[0].width / this.positions[0].width,
        ease: "expo.inOut",
        stagger: -0.05,
        onComplete: () => {
          gsap.to(this.els.cardGrid, { opacity: 0, delay: 0.25 });
          gsap.to(this.currentStack, { opacity: 1, delay: 0.25 });
        },
      });

      this.els.cardGrid.classList.remove("active");
    }
  }

  cachePositions() {
    return this.els.cardGridItems.map((item) => item.getBoundingClientRect());
  }

  convertToAbsoluteLayout() {
    gsap.set(this.els.cardGridItems, {
      position: "absolute",
      top: 0,
      left: 0,
      x: (index) => this.positions[index].x,
      y: (index) => this.positions[index].y,
      width: (index) => this.positions[index].width,
    });
  }

  cacheCurrentStackPositions() {
    const positions = [...this.currentStack.children].map((card) => {
      const { top, left, x, y, width } = card.getBoundingClientRect();
      return {
        top,
        left,
        x,
        y,
        width: (window.innerWidth - (64 + 64)) * 0.5,
        translateX: gsap.getProperty(card, "x"),
        translateY: gsap.getProperty(card, "y"),
        rotate: gsap.getProperty(card, "rotate"),
      };
    });

    return positions;
  }
}
