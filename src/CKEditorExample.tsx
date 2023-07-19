import "./App.css";
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import React, { Component, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { EditorConfig, Editor } from '@ckeditor/ckeditor5-core';
import Item from '@ckeditor/ckeditor5-engine/src/model/item';

// For the toolbar
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

// For exercise plugin
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Style from '@ckeditor/ckeditor5-style/src/style';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import ImageEditing from '@ckeditor/ckeditor5-image/src/image/imageediting';

// More custom exercise types
import CKEditorInputEx from "./CKEditorInputExPlugin";
import { SolutionInputFormEditable } from "./CKEditorInputExPlugin";
import CKEditorEditingMode from "./CKEditorEditingMode";
import List from "@ckeditor/ckeditor5-list/src/list";
import { TodoList } from "@ckeditor/ckeditor5-list";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";

class Exercise extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();

        const editor = this.editor;
        CKEditorInspector.attach(editor);

        // The button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('exercise', () => {
            // The button will be an instance of ButtonView.
            const button = new ButtonView();

            button.set({
                label: 'Exercise',
                withText: true
            });

            button.on('execute', () => {
                if (!editor.isReadOnly) {
                    insertEx(editor, "Question text?", "Solution text.");
                }
            });

            return button;
        });
    }

    // Define exercise components
    _defineSchema() {
        const schema = this.editor.model.schema;

        const dataFilter = this.editor.plugins.get('DataFilter');
        const dataSchema = this.editor.plugins.get('DataSchema');

        schema.register('question', {
            inheritAllFrom: '$block',
            allowIn: ['exercise'],
            allowChildren: ['extext'],
        });
        schema.register('solution', {
            inheritAllFrom: '$block',
            allowIn: ['exercise'],
            allowChildren: ['extext'],
        });
        schema.register('exercise', {
            inheritAllFrom: '$blockObject',
            allowChildren: ['question', 'solution'],
        })
        schema.register('extext', {
            inheritAllFrom: '$block',
            allowIn: ['question', 'solution'],
        })
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.elementToElement({
            model: 'question', view: {
                name: 'div',
                styles: {
                    'border': 'orange solid 1px',
                    'border-radius': '2px',
                    'padding': '0.3em',
                    'margin-bottom': '0.2em',
                }
            }
        });
        conversion.elementToElement({
            model: 'solution', view: {
                name: 'div',
                styles: {
                    'border': 'green solid 1px',
                    'border-radius': '2px',
                    'padding': '0.3em',
                    'margin-bottom': '0.2em',
                }
            }
        });
        conversion.elementToElement({
            model: 'exercise', view: {
                name: 'div',
                styles: {
                    'border': 'blue solid 1px',
                    'border-radius': '2px',
                    'padding': '0.3em',
                    'margin-bottom': '0.2em',
                }
            }
        });
        conversion.elementToElement({
            model: 'extext', view: {
                name: 'div',
                styles: {
                    'border': 'pink solid 1px',
                    'border-radius': '2px',
                    'padding': '0.3em',
                    'margin-bottom': '0.2em',
                }
            }
        });
    }
}

function insertEx(editor: Editor, qtext: string, soltext: string) {
    editor.model.change(writer => {
        const exercise = writer.createElement('exercise');
        const question = writer.createElement('question');
        const solution = writer.createElement('solution');
        const question_text = writer.createElement('extext');
        const solution_text = writer.createElement('extext');

        question_text._appendChild(writer.createText(qtext));
        solution_text._appendChild(writer.createText(soltext));

        question._appendChild(question_text);
        solution._appendChild(solution_text);

        exercise._appendChild([question, solution]);

        // Insert the text at the user's current position.
        editor.model.insertContent(exercise);
    });
}

function CKEditorExample() {
    const customConfigs: EditorConfig = {};
    customConfigs.plugins = [Essentials, Paragraph, ImageEditing,
        Exercise, CKEditorInputEx, CKEditorEditingMode,
        GeneralHtmlSupport, Style,
        Bold, Italic, BlockQuote,
        List, TodoList,
        Table, TableToolbar
    ];
    customConfigs.toolbar = ['exercise', 'input_ex', 'editing-mode', '|',
        'bold', 'italic', 'blockQuote', '|',
        'bulletedList', 'numberedList', 'todoList', '|',
        'insertTable', 'tableRow', 'tableColumn', 'mergeTableCells'
    ];


    const fetchExample = async () => {
        const response = await fetch('https://cat-fact.herokuapp.com/facts/', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const facts = await response.json();
        const rand_index = (Math.random() * facts.length) | 0;
        console.log(facts[rand_index].text);
        return facts[rand_index].text;
    }

    return (
        <><div className="App">
            <h2>Using CKEditor 5 build in React</h2>
            <CKEditor
                editor={ClassicEditor}
                data="<p>Hello from CKEditor 5!</p>"
                config={customConfigs}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!');
                    fetchExample().then((data) => {
                        const editor_root = editor.model.document.getRoot('main');
                        if (editor_root) {
                            editor.model.change(writer => {
                                console.log(data);
                                const paragraph = writer.createElement('paragraph');
                                const text = writer.createText("Funfact: " + data);
                                writer.append(text, paragraph);
                                writer.append(paragraph, editor_root);
                            })
                        }
                    });
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });

                    console.log("Change type:", event.name);

                    // Should only have 1 root named 'main'
                    const rootNames = editor.model.document.getRootNames();
                    const child_iter = editor.model.document.getRoot('main')?.getChildren();

                    let toRemove: Array<Item> = [];
                    for (let child of child_iter ? child_iter : []) {
                        if (child.is('element', 'solution') || child.is('element', 'question')) {
                            console.log('not exercise!!!');
                            toRemove.push(child);
                        }
                    }

                    editor.model.change(writer => {
                        for (let item of toRemove) {
                            writer.remove(item);
                        }
                    });
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                    console.log(editor.model.schema);
                }} />
        </div></>
    );
}

export default CKEditorExample;