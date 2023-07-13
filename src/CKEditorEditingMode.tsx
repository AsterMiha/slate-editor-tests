import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Element from '@ckeditor/ckeditor5-engine/src/model/element';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class CKEditorEditingMode extends Plugin {
    init() {
        const editor = this.editor;

        // Define toolbar button
        editor.ui.componentFactory.add('editing-mode', () => {
            const button = new ButtonView();

            button.set({
                label: 'Disable editing',
                withText: true
            });

            button.on('execute', () => {
                if (!editor.isReadOnly) {
                    editor.enableReadOnlyMode('editing');
                    button.set({
                        label: 'Disable editing',
                    })
                } else {
                    editor.disableReadOnlyMode('editing');
                    button.set({
                        label: 'Enable editing',
                    })
                }
                console.log("Readonly sfter button click", editor.isReadOnly);

                this.updateInputExercises(editor, editor.isReadOnly);
            });
            return button;
        });
    }

    updateInputExercises(editor: Editor, isReadOnly: Boolean) {
        const child_iter = editor.model.document.getRoot('main')?.getChildren();
        let toUpdate: Array<Element> = [];
        let currentType = 'inputFormEditableReact';
        let updatedType = 'inputFormReact';

        if (isReadOnly) {
            currentType = 'inputFormReact'
            updatedType = 'inputFormEditableReact'
        }

        for (let child of child_iter ? child_iter : []) {
            if (child.is('element', 'exercise')) {
                const ex_children = child.getChildren();
                for (let ex_child of ex_children ? ex_children : []) {
                    if (ex_child.is('element', currentType)) {
                        toUpdate.push(child);
                        break;
                    }
                }
            }
        }

        editor.model.change(writer => {
            for (let item of toUpdate) {
                for (let child of item.getChildren()) {
                    if (child.is('element', currentType)) {
                        writer.remove(child);
                        writer.append(writer.createElement(updatedType), item);
                        break;
                    }
                }
            }
        });

    }
}

export default CKEditorEditingMode;
