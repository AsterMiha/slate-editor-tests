Default constraints: https://docs.slatejs.org/concepts/11-normalizing#built-in-constraints
## Selection behavior
By default, the selection direction influences the fields that will be merged when deleting the selected section.
## Copy paste
Pasting inside a text element: all copied parts become text.
Pasing on a new line: all parts keep their initial type (exercise/question/solution)

## Editable divs
By default, the entire divs containing Slate elements are marked as editable. However changes in text not enclosed in a Slate element result in errors. We should avoid rendering elements managed by Slate along with other elements in the same div.

## TODO
- [x] copy paste for simple example:
    - by default, sections copied across multiple types of elements become the children of the node they are copied into
    - should they just all take the element type of the paste location?
    - should it depend on the past location? eg. if parent is exercise we create a new exercise with the copied fields, if question or solution convert all to the parent type
    - fix when nesting level is too high
    - onPaste for Editor or insertData for Editable?

- [x] finalize impl for missing nodes
- [ ] wrap question and solution in exercise if needed
- [ ] additional nodes
- [ ] enable richtext pasting
- [x] undo: https://docs.slatejs.org/libraries/slate-history
- [ ] ? add empty fields between exercises for pasting exercises directly between other exercises

- [ ] placeholder text: https://jkrsp.com/slate-js-placeholder-per-line/

- [ ] testing: https://github.com/mwood23/slate-test-utils
- [ ] Serlo design
