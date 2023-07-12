import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
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
            });
            return button;
        });
    }
}

export default CKEditorEditingMode;
