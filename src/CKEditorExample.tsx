import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { EditorConfig } from '@ckeditor/ckeditor5-core';

// for the toolbar
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

function CKEditorExample() {
    const customConfigs: EditorConfig = {};
    customConfigs.plugins = [ Essentials, Paragraph, Heading, Bold, Italic ];
    customConfigs.toolbar = [ 'bold', 'italic' ];

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