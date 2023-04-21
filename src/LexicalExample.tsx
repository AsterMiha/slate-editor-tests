import "./App.css";

import {
  $createLineBreakNode, $createTextNode, $getRoot, $getSelection,
  EditorConfig, EditorState,
  ElementNode, LexicalEditor, LexicalNode, ParagraphNode, RootNode
} from 'lexical';
import {$dfs} from '@lexical/utils';
import {useEffect} from 'react';

import {InitialConfigType, LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';

import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

class QuestionNode extends ElementNode {
  // getType, clone - mandatory to implement
  static getType(): string {
    return 'question';
  }

  static clone(node: ParagraphNode): QuestionNode {
    return new QuestionNode();
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const element = document.createElement('div');
    element.style.border = 'orange solid 1px';
    element.style.borderRadius = '2px';
    element.style.padding = '0.3em';
    element.style.marginBottom = '0.2em';

    // No need to manually manage the children here

    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  // importJSON, exportJSON - should also be implemented for more complex formats
}

export function $createQuestionNode(): QuestionNode {
  return new QuestionNode();
}

export function $isQuestionNode(node: LexicalNode): boolean {
  return node instanceof QuestionNode;
}

class SolutionNode extends ElementNode {
  // getType, clone - mandatory to implement
  static getType(): string {
    return 'solution';
  }

  static clone(node: ParagraphNode): SolutionNode {
    return new SolutionNode();
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const element = document.createElement('div');
    element.style.border = 'green solid 1px';
    element.style.borderRadius = '2px';
    element.style.padding = '0.3em';
    element.style.marginBottom = '0.2em';

    // No need to manually manage the children here

    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  // importJSON, exportJSON - should also be implemented for more complex formats
}

export function $createSolutionNode(): SolutionNode {
  return new SolutionNode();
}

export function $isSolutionNode(node: LexicalNode): boolean {
  return node instanceof SolutionNode;
}

class ExerciseNode extends ElementNode {
  // getType, clone - mandatory to implement
  static getType(): string {
    return 'exercise';
  }

  static clone(node: ParagraphNode): ExerciseNode {
    return new ExerciseNode();
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const element = document.createElement('div');
    element.style.border = 'blue solid 1px';
    element.style.borderRadius = '2px';
    element.style.padding = '0.3em';

    // No need to manually manage the children here

    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  // importJSON, exportJSON - should also be implemented for more complex formats
}

export function $createExerciseNode(): ExerciseNode {
  return new ExerciseNode();
}

export function $isExerciseNode(node: LexicalNode): boolean {
  return node instanceof ExerciseNode;
}

function setInitialValue() {
  const root: RootNode = $getRoot();
  if (root.getFirstChild() === null) {
    let exercise = $createExerciseNode();
    let question = $createQuestionNode();
    let solution = $createSolutionNode();

    // Create first question
    question.append(
      $createTextNode("Question 1"),
    );

    // Create first solution
    solution = $createSolutionNode();
    solution.append(
      $createTextNode("Line 1"),
      $createLineBreakNode(),
      $createTextNode("Line 2"),
    );

    // Add first exercise
    exercise.append(question, solution);
    root.append(exercise);

    // Create second exercise
    exercise = $createExerciseNode();

    // Create second question
    question = $createQuestionNode();
    question.append(
      $createTextNode("Question 2"),
    );

    // Create second solution
    solution = $createSolutionNode();
    solution.append(
      $createTextNode("Line 1"),
      $createLineBreakNode(),
      $createTextNode("Line 2"),
    );

    // Add second exercise
    exercise.append(question, solution);
    root.append(exercise);
  }
}

const editor_theme = {
  // Theme styling goes here
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log($dfs(root));
  });
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function LexicalExample() {
  const initialConfig: InitialConfigType = {
    namespace: 'MyEditor', 
    theme: editor_theme,
    onError,
    editorState: setInitialValue,
    nodes: [ExerciseNode, SolutionNode, QuestionNode, ParagraphNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
    </LexicalComposer>
  );
}

export default LexicalExample;
