import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/Accordion/Accordion";
import "./components/Accordion/AccordionItem";

@customElement("my-example")
export default class MyExample extends LitElement {
  protected render(): unknown {
    return html`
      <div>
        <x-accordion>
          <x-accordion-item label="Option 1" @toggle=${(e: CustomEvent) =>
            console.log(e)
          }>
            My World!
          </x-accordion-item>
          <x-accordion-item label="Option 2">
            Hi Shl!
          </x-accordion-item>
          <x-accordion-item label="Option 3" disabled>
            Hello World!
          </x-accordion-item>
          <p style="color: red;">hello shl</p>
          <p style="color: red;">hello shl 2</p>
        </x-accordion>
      </div>
    `;
  }
}
