## feature

- [ ] disabled
- [ ] multiple open
- [ ] single open
- [ ] content slot
- [ ] header slot
- [ ] icon & animation
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
  `Accordion` controls
