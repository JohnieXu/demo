import { html, LitElement } from "lit";
import { customElement, property, queryAssignedNodes } from "lit/decorators.js";
import type AccordionItem from "./AccordionItem";

@customElement('x-accordion')
export default class Accordion extends LitElement {

  @property({ type: Boolean })
  multiple = false;

  @queryAssignedNodes()
  private listItems: NodeListOf<AccordionItem>;

  public get items() {
    return this.listItems
  }

  connectedCallback() {
    super.connectedCallback();
    console.log(this.items);
  }

  updated() {
    console.log(this.items);
  }

  onToggle (e: CustomEvent) {
    const target = e.target as AccordionItem;
    console.log('accordion onToggle', e, target);
    if (this.multiple || !this.items || !this.items.length) {
      return;
    }
    this.items.forEach(item => {
      if (item !== target) {
        item.open = false;
      } else {
        item.open = true;
      }
    })
  }

  protected render() {
    return html`
      <div>
        <slot @toggle="${this.onToggle}"></slot>
      </div>
    `
  }
}