## feature

- [x] disabled
- [x] multiple open
- [x] single open
- [x] content slot
- [ ] header slot
- [ ] icon & animation
- [ ] icon slot
- [ ] style: line between each child items

## implementation

### multiple/single

AccordionItem trigger toggle event
take an `event` with target to parent Accordion
Accordion receive event from AccordionItem, toggle or close other items

how to find all children AccordionItems?
  use [queryAssignedNodes](https://lit.dev/docs/api/decorators/#queryAssignedNodes)

how to filter out only AccordionItems? exclude: div/span/text...
  `event.target` is the AccordionItem itself

how to implement only one item open at initial state?
  in `connectedCallback` callback?

### style

line between each child items?
  `AccordionItem` add `:host`, use `:host(:not(:first-child))` to set border-top to transparent

### icon & animation

