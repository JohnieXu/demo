import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";

const iconMap: Record<string, () => TemplateResult> = {
  'chevron': () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="24" height="24" fill="currentColor">
    <path d="M3 9.95a.875.875 0 0 1-.615-1.498L5.88 5 2.385 1.547A.875.875 0 0 1 3.615.302L7.74 4.377a.876.876 0 0 1 0 1.246L3.615 9.698A.87.87 0 0 1 3 9.95"></path>
  </svg>`,
}

@customElement('x-icon')
export default class Icon extends LitElement {
  @property({ type: String })
  name = '';
  @property({ type: String })
  size = '10px';

  
  static styles = css`
    :host {
      display: inline-block;
      width: var(--icon-size, 10px);
      height: var(--icon-size, 10px);
    }
    svg {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  `

  protected renderIcon = (): TemplateResult => {
    return iconMap[this.name]();
  }

  render() {
    return html`
      ${when(this.size && this.name && iconMap[this.name], this.renderIcon)}
    `
  }
}
