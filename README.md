Default constraints: https://docs.slatejs.org/concepts/11-normalizing#built-in-constraints
## Selection behavior
By default, the selection direction influences the fields that will be merged when deleting the selected section.
## Copy paste
Pasting inside a text element: all copied parts become text
Pasing on a new line: all parts keep their initial type (exercise/question/solution)
## TODO
- [ ] copy paste for simple example:
    - by default, sections copied across multiple types of elements become the children of the node they are copied into
    - should they just all take the element type of the paste location?
    - should it depend on the past location? eg. if parent is exercise we create a new exercise with the copied fields, if question or solution convert all to the parent type
    - fix when nesting level is too high
    - onPaste for Editor or insertData for Editable?
    - !!! error when we paste over a section that is not part of the editor -> how to stop cursor from selecting those sections

- [x] finalize impl for missing nodes
- [ ] wrap question and solution in exercise if needed
- [ ] additional nodes
- [ ] consistent selection
- [ ] enable richtext pasting
- [ ] undo: import { withHistory } from 'slate-history'
            https://docs.slatejs.org/libraries/slate-history

- [ ] placeholder text: https://jkrsp.com/slate-js-placeholder-per-line/

- [ ] testing: https://github.com/mwood23/slate-test-utils
- [ ] Serlo design
