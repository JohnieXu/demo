import { css, html, LitElement } from "lit";
import "./components/AppCard/AppCard";
import { customElement } from "lit/decorators.js";

@customElement('apple-app')
export default class AppleApp extends LitElement {
  static styles = [
    css`
      .today-card {
        width: 100%;
        padding: 0 25px;
        box-sizing: border-box;
      }
      `
  ]
  protected render(): unknown {
    return html`
      <div class="today-card">
        <x-app-card primary-color="#224d31" image="https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/0c/db/e5/0cdbe59a-cda5-c3a9-64eb-cd7ebf3af0e8/0031d5c2-09c3-45ab-b40e-656e2abd3151.png/1476x1968sr.webp"></x-app-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apple-app': AppleApp;
  }
}
