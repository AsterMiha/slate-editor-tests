import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

import { Editor } from '@ckeditor/ckeditor5-core';
import { FormEvent, useState } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { IndexType } from 'typescript';


function insertEx(editor: Editor, qtext: string) {
    editor.model.change(writer => {
        const exercise = writer.createElement('exercise');
        const question = writer.createElement('question');
        const question_text = writer.createElement('extext');
        const solutionForm = writer.createElement('inputFormReact');

        question_text._appendChild(writer.createText(qtext));

        question._appendChild(question_text);

        exercise._appendChild([question, solutionForm]);

        editor.model.insertContent(exercise);
    });
}

interface ExerciseSolution {
    solution: string,
}

function CheckExerciseSolution({ solution }: ExerciseSolution) {
    console.log("Checking: ", solution);
    if (solution === '')
        return <></>
    if (solution === '5')
        return <>Good job!</>
    return <>Wrong answer</>
}

export function SolutionInputForm() {
    const [state, setSolution] = useState(
        {
            solution: '',
        }
    );

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            solution: { value: string }
        };
        console.log("Submit event", event);
        const exsolution = target.solution.value;
        console.log("Solution input: ", exsolution);
        setSolution({ solution: exsolution });
    };
    return (<>
        <form onSubmit={handleSubmit}>
            <input name="solution" type="text" />
            <button type="submit">Submit</button>
        </form>
        < CheckExerciseSolution solution={state.solution} />
    </>
    );
}

export function SolutionInputFormEditable() {
    const [inputFields, setInputFields] = useState([
        {solutionOption: '', feedbackOption: ''}
    ])

    const handleFormChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        let data = [...inputFields];
        const target = event.target as typeof event.target & {
            value: string,
        }
        const name: string = target.name;
        switch(name) {
            case "solutionOption":
            case "feedbackOption":
                data[index][name] = target.value;
                break;
            default:
                break;
        }
        setInputFields(data);
    }

    const addFields = () => {
        let newfield = { solutionOption: '', feedbackOption: '' }
        setInputFields([...inputFields, newfield])
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
    };
    return (<>
        <form onSubmit={handleSubmit}>
            {inputFields.map((input, index) => {
            return (
                <div key={index}>
                <input
                    name='solutionOption'
                    placeholder='Solution'
                    value={input.solutionOption}
                    onChange={event => handleFormChange(index, event)}
                />
                <input
                    name='feedbackOption'
                    placeholder='Feedback'
                    value={input.feedbackOption}
                    onChange={event => handleFormChange(index, event)}
                />
                </div>
            )
            })}
            <button onClick={addFields}>Add</button>
            <button type="submit">Save</button>
        </form>
    </>
    );
}

function renderExercise(domElement: ReactDOM.Container, isReadOnly: Boolean) {
    const root = createRoot(domElement as DocumentFragment);
    if (!isReadOnly)
        root.render(<SolutionInputForm />);
    else
        root.render(<SolutionInputFormEditable />);
}

class CKEditorInputEx extends Plugin {
    init() {
        const editor = this.editor;
        this._defineSchema();
        this._defineConverters();

        // Define toolbar button
        editor.ui.componentFactory.add('input_ex', () => {
            const button = new ButtonView();

            button.set({
                label: 'Input exercise',
                withText: true
            });

            button.on('execute', () => {
                if (!editor.isReadOnly) {
                    insertEx(editor, "Question text?");
                }
            });

            return button;
        });
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('inputFormReact', {
            isLimit: true,
            allowWhere: 'question',
        });

        schema.register('inputFormEditableReact', {
            isLimit: true,
            allowWhere: 'question',
        });
    }

    _defineConverters() {
        const editor = this.editor;
        const conversion = editor.conversion;

        conversion.for('downcast').elementToElement({
            model: 'inputFormReact',
            view: (modelElement, { writer: viewWriter }) => {

                // Border CKEditor can interact with
                const section = viewWriter.createContainerElement('div', {
                    class: 'inputEx',
                });

                // React wrapper
                const reactWrapper = viewWriter.createRawElement('div', {
                    class: 'inputEx__react-wrapper'
                }, function (domElement) {
                    renderExercise(domElement, true);
                });

                // Insert wrapped React component at the start of the CKEditor section
                viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper);

                // Convert to widget
                const widget = toWidget(section, viewWriter);
                // Input field only works if this attribure is set to true, otherwise we can only interact with the button
                // https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/ui/widget-internals.html#exclude-dom-events-from-default-handlers
                widget._setAttribute('data-cke-ignore-events', true);
                return widget;
            }
        })

        conversion.for('downcast').elementToElement({
            model: 'inputFormEditableReact',
            view: (modelElement, { writer: viewWriter }) => {

                // Border CKEditor can interact with
                const section = viewWriter.createContainerElement('div', {
                    class: 'inputEditableEx',
                });

                // React wrapper
                const reactWrapper = viewWriter.createRawElement('div', {
                    class: 'inputEditableEx__react-wrapper'
                }, function (domElement) {
                    renderExercise(domElement, false);
                });

                // Insert wrapped React component at the start of the CKEditor section
                viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper);

                // Convert to widget
                const widget = toWidget(section, viewWriter);
                // Input field only works if this attribure is set to true, otherwise we can only interact with the button
                // https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/ui/widget-internals.html#exclude-dom-events-from-default-handlers
                widget._setAttribute('data-cke-ignore-events', true);
                return widget;
            }
        })
    }
}

export default CKEditorInputEx;
