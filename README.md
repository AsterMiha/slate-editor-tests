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
- [x] add exercise toolbar button
- [x] create exercise schema
- [x] create exercise view: https://ckeditor.com/docs/ckeditor5/latest/framework/plugins/abbreviation-plugin/abbreviation-plugin-level-1.html
- [x] schemas for exercise components: https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_schema-Schema.html
- [ ] template for exercise structure: https://ckeditor.com/docs/ckeditor5/latest/features/template.html
- [ ] insert new exercise when cursor inside a different exercise
- [ ] only allow 1 question and 1 solution inside an exercise
- [ ] selection and pasing behavior

