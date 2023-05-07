## Usage
Run examples with: `yarn start`

The implemented examples can be found here:
- Slate: http://localhost:3000/slate
- Lexical: http://localhost:3000/lexical
- CKEditor: http://localhost:3000/cke

## Slate implementation
- [x] copy paste for simple example
- [x] finalize impl for missing nodes
- [x] wrap question and solution in exercise -> can't paste outside of paragraphs so not needed currently
- [x] additional nodes
- [x] undo: https://docs.slatejs.org/libraries/slate-history
- [x] add images
- [ ] unchangeable text (contenteditable="false" in the div)
- [ ] scale images: https://github.com/udecode/plate
- [ ] placeholder text: https://jkrsp.com/slate-js-placeholder-per-line/
- [ ] enable richtext pasting

- [ ] testing: https://github.com/mwood23/slate-test-utils
- [ ] Serlo design

## Lexical implementation
- [x] show simple editor
- [x] add initial text
- [x] add borders to the different elements
- [x] undo/redo: @lexical/history
- [x] fixed format:
    - poll example: https://lexical.dev/docs/demos/plugins/poll
    - node transforms: https://lexical.dev/docs/concepts/transforms

## CKEditor
- [x] show simple editor
