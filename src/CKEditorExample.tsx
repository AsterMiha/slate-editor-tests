import "./App.css";
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { EditorConfig } from '@ckeditor/ckeditor5-core';

// For the toolbar
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

// For exercise plugin
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Style from '@ckeditor/ckeditor5-style/src/style';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';

class Exercise extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();

        const editor = this.editor;
        CKEditorInspector.attach( editor );

        // editor.commands.execute('style', "ExerciseStyle");

        // The button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'exercise', () => {
            // The button will be an instance of ButtonView.
            const button = new ButtonView();

            button.set( {
                label: 'Exercise',
                withText: true
            } );

            button.on( 'execute', () => {
                // Change the model using the model writer.
                editor.model.change( writer => {
                    const exercise =  writer.createElement('exercise');
                    const question =  writer.createElement('question');
                    const solution =  writer.createElement('solution');

                    question._appendChild(writer.createText('Question text?'));
                    solution._appendChild(writer.createText('Solution text', {style: 'exercise'}));
                    exercise._appendChild([question, solution]);
                    // Insert the text at the user's current position.
                    editor.model.insertContent(exercise);
                } );
            });

            return button;
        });
    }

    // Define exercise components
    _defineSchema() {
        const schema = this.editor.model.schema;


        const dataFilter = this.editor.plugins.get( 'DataFilter' );
        const dataSchema = this.editor.plugins.get( 'DataSchema' );

        schema.register('question', {
            // isLimit: true, // Don't split with enter
            inheritAllFrom: '$block',
            allowIn: [ 'exercise' ],
        });
        schema.register('solution', {
            // isLimit: true, // Don't split with enter
            inheritAllFrom: '$block',
            allowIn: [ 'exercise' ]
        });
        schema.register('exercise', {
            inheritAllFrom: '$blockObject'
        })
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.elementToElement( { model: 'question', view: {
            name: 'div',
            styles: {
                'border': 'orange solid 1px',
                'border-radius': '2px',
                'padding': '0.3em',
                'margin-bottom': '0.2em',
            }
        } } );
        conversion.elementToElement( { model: 'solution', view: {
            name: 'div',
            styles: {
                'border': 'green solid 1px',
                'border-radius': '2px',
                'padding': '0.3em',
                'margin-bottom': '0.2em',
            }
        } } );
        conversion.elementToElement( { model: 'exercise', view: {
            name: 'div',
            styles: {
                'border': 'blue solid 1px',
                'border-radius': '2px',
                'padding': '0.3em',
                'margin-bottom': '0.2em',
            }
        } } );
    }
}

function CKEditorExample() {
    const customConfigs: EditorConfig = {};
    customConfigs.plugins = [ Essentials, Paragraph, Exercise, GeneralHtmlSupport, Style ];
    customConfigs.toolbar = [ 'exercise', 'style' ];

    return (
        <div className="App">
        <h2>Using CKEditor 5 build in React</h2>
        <CKEditor
            editor={ ClassicEditor }
            data="<p>Hello from CKEditor 5!</p>"
            config={customConfigs}
            onReady={ editor => {
                // You can store the "editor" and use when it is needed.
                console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                console.log( { event, editor, data } );
            } }
            onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
            } }
            onFocus={ ( event, editor ) => {
                console.log( 'Focus.', editor );
                console.log(editor.model.schema);
            } }
        />
    </div>
    );
  }
  
  export default CKEditorExample;