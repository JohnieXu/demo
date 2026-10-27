import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement('x-app-card')
export default class AppCard extends LitElement {
  static styles = [
    css`
      .card {
        width: 100%;
        aspect-ratio: 3/4;
        border-radius: 16px;
        background-color: var(--primary-color);
        border: 4px solid var(--primary-color);
        box-sizing: border-box;
        overflow: hidden;
      }
      .event-wrapper {
        position: relative;
        .time {
          position: absolute;
          top: 0;
          left: 0;
          background-color: var(--primary-color);
          z-index: 3;
          padding: 6px 10px 6px 8px;
          border-end-end-radius: 16px;
          font-weight: 700;
          font-size: 13px;
        }
      }
      .image-wrapper {
        width: 100%;
        height: 100%;
        border-radius: 16px;
      }
      .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `
  ]

  @property({ type: String })
  image = '';

  @property({ type: String })
  title = '';

  @property({ type: String })
  subtitle = '';

  @property({ type: String, attribute: 'primary-color' })
  primaryColor = '#000';

  protected render(): unknown {
    return html`
      <div class="card" style=${styleMap({ '--primary-color': this.primaryColor })}>
        <div class="event-wrapper">
          <time class="time">NOW AVAILABLE</time>
        </div>
        <div class="image-wrapper">
          <picture>
            <source srcset="${this.image}" type="image/webp">
            <img class="image" src="${this.image}" alt="${this.title}" crossorigin="anonymous">
          </picture>
        </div>
        <div class="content-wrapper">
          <div class="info">
            <a>
              <p class="tag">MAJOR UPDATE</p>
              <h2 class="title">${this.title}</h2>
              <p class="subtitle">${this.subtitle}</p>
            </a>
            <div class="buttom">
              
            </div>
          </div>
        </div>
      </div>
    `
  }
}