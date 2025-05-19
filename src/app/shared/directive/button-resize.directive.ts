import { Directive, ElementRef, Renderer2, AfterViewInit, HostListener } from "@angular/core";

@Directive({
  selector: "[appButtonResize]",
})
export class ButtonResizeDirective implements AfterViewInit {
  private labelEl: HTMLElement | null = null;
  private buttonEl: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.buttonEl = this.el.nativeElement;
  }

  ngAfterViewInit(): void {
    this.labelEl = this.buttonEl.querySelector(".p-button-label");
    this.checkWidth();
  }

  @HostListener("window:resize")
  onResize() {
    this.checkWidth();
  }

  private checkWidth(): void {
    const width = this.buttonEl.offsetWidth;

    if (width < 150) {
      if (this.labelEl) {
        this.renderer.setStyle(this.labelEl, "display", "none");
      }
      this.renderer.setStyle(this.buttonEl, "justify-content", "center");
      this.renderer.setStyle(this.buttonEl, "width", "100%");
    } else {
      if (this.labelEl) {
        this.renderer.setStyle(this.labelEl, "display", "inline");
      }
      this.renderer.removeStyle(this.buttonEl, "justify-content");
      this.renderer.removeStyle(this.buttonEl, "width");
    }
  }
}
