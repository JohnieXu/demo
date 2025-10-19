import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement('x-accordion-item')
export default class AccordionItem extends LitElement {

  @property({ type: Boolean })
  open = true;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  label = '';

  static styles = [
    css`
    .disabled {
      .header {
        cursor: initial;
        opacity: 0.5;
      }
      .header:hover {
        background-color: initial;
      }
    }
    .header {
      cursor: pointer;
      margin: 0;
      padding: 0.5rem;
      font-size: 20px;
      font-weight: bold;
      user-select: none;
    }
    .header:hover {
      background-color: rgba(200,200,200,0.5);
    }
    .content {
      padding: 0.5rem;
    }
    .content.closed {
      display: none;
    }
    `
  ]
  
  protected render(): unknown {
    const classes = {
      'open': this.open,
      'disabled': this.disabled,
    }
      return html`
        <div class="${classMap(classes)}">
          <h2 class="header" @click="${this.onClick}">${this.label}</h2>
          <div class="content ${classMap({'closed': !this.open || this.disabled})}">
            <slot></slot>
          </div>
        </div>
      `
  }

  public onClick() {
    if (this.disabled) {
      return;
    }
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('toggle', {
      cancelable: true,
      bubbles: true,
      detail: {
        open: this.open,
      }
    }))
  }
}