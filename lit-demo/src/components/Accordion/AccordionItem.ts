import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../Icon/Icon.js";

@customElement('x-accordion-item')
export default class AccordionItem extends LitElement {

  @property({ type: Boolean })
  open = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  label = '';

  static styles = [
    css`
      :host {
        display: block;
        border-block-end: 1px solid #ccc;
        border-color: #ccc;
      }
      :host(:first-of-type) {
        border-block-start: 1px solid #ccc;
        border-color: #ccc;
      }
      .header .header__icon{
        transition: transform 0.2s ease-in-out;
      }
      .open .header .header__icon{
        transform: rotate(90deg);
      }
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
        display: flex;
        align-items: center;
      }
      .header:hover {
        background-color: rgba(200,200,200,0.5);
      }
      .header__label {
        margin: 0;
        margin-left: 0.5rem;
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
          <h2 class="header" @click="${this.onClick}">
            <x-icon class="header__icon" name="chevron" size="12px"></x-icon>
            <div class="header__label">${this.label}</div>
          </h2>
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

declare global {
  interface HTMLElementTagNameMap {
    'x-accordion-item': AccordionItem;
  }
}
