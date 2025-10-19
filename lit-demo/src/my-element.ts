import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/accordion/sp-accordion.js';
import '@spectrum-web-components/accordion/sp-accordion-item.js';
import '@spectrum-web-components/checkbox/sp-checkbox.js';
import '@spectrum-web-components/field-group/sp-field-group.js';

@customElement('my-element')
export default class MyElement extends LitElement {
    render() {
        return html`
        <sp-theme system="spectrum" scale="medium" color="light" >
            <sp-accordion>
            <sp-accordion-item label="Heading 1">
                <div>Item 1</div>
            </sp-accordion-item>
            <sp-accordion-item disabled label="Heading 2">
                <div>Item 2</div>
            </sp-accordion-item>
        </sp-accordion>
        <h2>
        Accordion with Checkbox
        </h2>
      <sp-accordion>
        <sp-accordion-item label="Spectrum design" open>
          <sp-field-group vertical>
            <sp-checkbox>Thing 1</sp-checkbox>
            <sp-checkbox>Thing 2</sp-checkbox>
            <sp-checkbox>Thing 3</sp-checkbox>
            <sp-checkbox>Thing 4</sp-checkbox>
          </sp-field-group>
        </sp-accordion-item>
        
      </sp-accordion>
        </sp-theme>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
    }
}
