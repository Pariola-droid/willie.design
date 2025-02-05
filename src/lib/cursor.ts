import { gsap } from 'gsap';

interface CursorOptions {
  container: string;
  speed: number;
  ease: string;
  visibleTimeout: number;
}

interface CursorPosition {
  x: number;
  y: number;
}

interface StickPosition {
  x: number;
  y: number;
}

export default class Cursor {
  private options: CursorOptions;
  private body: HTMLElement;
  private el: HTMLDivElement;
  private text: HTMLDivElement;
  private visible: boolean = false;
  private visibleInt?: number;
  private pos?: CursorPosition;
  private stick: StickPosition | false = false;

  constructor(options: Partial<CursorOptions> = {}) {
    this.options = {
      container: 'body',
      speed: 0.7,
      ease: 'expo.out',
      visibleTimeout: 300,
      ...options,
    };

    this.body = document.querySelector(this.options.container) as HTMLElement;
    if (!this.body)
      throw new Error(`Container ${this.options.container} not found`);

    this.el = document.createElement('div');
    this.el.className = 'cb-cursor';

    this.text = document.createElement('div');
    this.text.className = 'cb-cursor-text';

    this.init();
  }

  private init(): void {
    this.el.appendChild(this.text);
    this.body.appendChild(this.el);
    this.bind();
    this.move(-window.innerWidth, -window.innerHeight, 0);
  }

  private bind(): void {
    // Mouse leave/enter for body
    this.body.addEventListener('mouseleave', () => this.hide());
    this.body.addEventListener('mouseenter', () => this.show());

    // Mouse movement
    this.body.addEventListener('mousemove', (e: MouseEvent) => {
      this.pos = {
        x: this.stick
          ? this.stick.x - (this.stick.x - e.clientX) * 0.15
          : e.clientX,
        y: this.stick
          ? this.stick.y - (this.stick.y - e.clientY) * 0.15
          : e.clientY,
      };
      this.update();
    });

    // Mouse down/up
    this.body.addEventListener('mousedown', () => this.setState('-active'));
    this.body.addEventListener('mouseup', () => this.removeState('-active'));

    // Handle interactive elements
    const handleInteractiveEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a,input,textarea,button')) {
        this.setState('-pointer');
      }
      if (target.matches('iframe')) {
        this.hide();
      }

      // Data attributes
      const cursorAttr = target.getAttribute('data-cursor');
      if (cursorAttr) {
        this.setState(cursorAttr);
      }

      const cursorText = target.getAttribute('data-cursor-text');
      if (cursorText) {
        this.setText(cursorText);
      }

      const cursorStick = target.getAttribute('data-cursor-stick');
      if (cursorStick) {
        this.setStick(cursorStick);
      }
    };

    const handleInteractiveLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a,input,textarea,button')) {
        this.removeState('-pointer');
      }
      if (target.matches('iframe')) {
        this.show();
      }

      const cursorAttr = target.getAttribute('data-cursor');
      if (cursorAttr) {
        this.removeState(cursorAttr);
      }

      if (target.hasAttribute('data-cursor-text')) {
        this.removeText();
      }

      if (target.hasAttribute('data-cursor-stick')) {
        this.removeStick();
      }
    };

    this.body.addEventListener('mouseenter', handleInteractiveEnter, true);
    this.body.addEventListener('mouseleave', handleInteractiveLeave, true);
  }

  private setState(state: string): void {
    this.el.classList.add(state);
  }

  private removeState(state: string): void {
    this.el.classList.remove(state);
  }

  private toggleState(state: string): void {
    this.el.classList.toggle(state);
  }

  private setText(text: string): void {
    this.text.innerHTML = text;
    this.el.classList.add('-text');
  }

  private removeText(): void {
    this.el.classList.remove('-text');
  }

  private setStick(selector: string): void {
    const target = document.querySelector(selector);
    if (!target) return;

    const bound = target.getBoundingClientRect();
    this.stick = {
      y: bound.top + bound.height / 2,
      x: bound.left + bound.width / 2,
    };
    this.move(this.stick.x, this.stick.y, 5);
  }

  private removeStick(): void {
    this.stick = false;
  }

  private update(): void {
    this.move();
    this.show();
  }

  private move(x?: number, y?: number, duration?: number): void {
    gsap.to(this.el, {
      x: x ?? this.pos?.x ?? 0,
      y: y ?? this.pos?.y ?? 0,
      force3D: true,
      overwrite: true,
      ease: this.options.ease,
      duration: this.visible ? duration ?? this.options.speed : 0,
    });
  }

  private show(): void {
    if (this.visible) return;
    window.clearTimeout(this.visibleInt);
    this.el.classList.add('-visible');
    this.visibleInt = window.setTimeout(() => (this.visible = true));
  }

  private hide(): void {
    window.clearTimeout(this.visibleInt);
    this.el.classList.remove('-visible');
    this.visibleInt = window.setTimeout(
      () => (this.visible = false),
      this.options.visibleTimeout
    );
  }
}
