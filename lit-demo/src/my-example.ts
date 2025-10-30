import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/Accordion/Accordion";
import "./components/Accordion/AccordionItem";

@customElement("my-example")
export default class MyExample extends LitElement {
  updated(updatedProperties: unknown) {
    const el = document.querySelector('x-accordion');
    if (el) {
      console.log(el.multiple)
    }
    console.log('my-example updated', el, updatedProperties);
  }
  protected render(): unknown {
    return html`
      <div>
        <x-accordion>
          <p>single</p>
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
        </x-accordion>
        <x-accordion multiple>
          <p>multiple</p>
          <x-accordion-item label="Option 1" @toggle=${(e: CustomEvent) =>
            console.log(e)
          } open>
            My World!
          </x-accordion-item>
          <x-accordion-item label="Option 2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            voluptatum.
          </x-accordion-item>
          <x-accordion-item label="Option 3">
            Hello World!
          </x-accordion-item>
        </x-accordion>
      </div>
    `;
  }
}
