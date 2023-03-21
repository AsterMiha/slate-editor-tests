import "./App.css";

// Import React dependencies.
import React, { useState, useCallback } from "react";
// Import the Slate editor factory.
import {
  createEditor,
  Descendant,
  Transforms,
  Editor,
} from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";
import { Exercise, Question, Solution } from "./react-app-env";

const initialValue: Descendant[] = [
  {
    type: "exercise",
    children: [
      {
        type: "question",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "What is the capital of Germany?" },
            ],
          },
        ],
      },
      {
        type: "solution",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Paragraph 1" }],
          },
          {
            type: "paragraph",
            children: [{ type: "text", text: "Paragraph 2" }],
          },
        ],
      },
    ],
  },
  {
    type: "exercise",
    children: [
      {
        type: "question",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Question2?" }],
          },
        ],
      },
      {
        type: "solution",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Paragraph 1" }],
          },
          {
            type: "paragraph",
            children: [{ type: "text", text: "Paragraph 2" }],
          },
        ],
      },
    ],
  },
];

const emptyQ: Question = {
  type: "question",
  children: [
    {
      type: "paragraph",
      children: [{ type: "text", text: "Question text?" }],
    },
  ],
};

const emptyS: Solution = {
  type: "solution",
  children: [
    {
      type: "paragraph",
      children: [{ type: "text", text: "Solution text" }],
    },
  ],
};

function App() {
  const [editor] = useState(() =>
    withCustomNormalization(withReact(createEditor()))
  );

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "question":
        return (
          <div
            style={{
              border: "orange solid 1px",
              borderRadius: "2px",
              padding: "0.3em",
              marginBottom: "0.2em"
            }}
            {...props.attributes}
          >
            {" "}
            {props.children}{" "}
          </div>
        );
      case "exercise":
        return (
          <div
            style={{
              border: "blue solid 1px",
              borderRadius: "2px",
              padding: "0.3em",
            }}
            {...props.attributes}
          >
            {" "}
            {props.children}{" "}
          </div>
        );
      case "code":
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        );
      case "paragraph":
        return <p {...props.attributes}> {props.children} </p>;
      case "solution":
        return (
          <div
            style={{
              border: "green solid 1px",
              borderRadius: "2px",
              padding: "0.3em",
            }}
            {...props.attributes}
          >
            {" "}
            {props.children}{" "}
          </div>
        );
    }
  }, []);

  return (
    <div style={{padding: "2em"}}>
    <Slate editor={editor} value={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
    </div>
  );
}

function addMissing(exercise: Exercise): Exercise {
  const question: Question = emptyQ;
  const solution: Solution = emptyS;

  if (exercise.children.length === 2)
    return exercise;

  let newExercise: Exercise = {
    type: 'exercise',
    children: [question, solution],
  }

  console.log(exercise.children);
  if (question.children.length === 0) {
    newExercise.children[0] = emptyQ;
  }

  if (solution.children.length === 0) {
    newExercise.children[1] = emptyS;
  }

  return newExercise;
}

function withCustomNormalization(editor: Editor) {
  let { normalizeNode } = editor;

  editor.normalizeNode = ([entry, path]) => {
    if (path.length === 0) {
      console.log(editor.children.length);

      console.log("___________");
      // Check that all elements are exercises
      for (let i = 0; i < editor.children.length; i++) {
        console.log("- " + i + ": " + editor.children[i].type);
        const element = editor.children[i];
        if (element.type === "exercise" && element.children.length !== 2) {
          console.log(element.children.length);
          // Check exercise composition
          const newEx: Exercise = addMissing(element);
          // Transforms.setNodes(editor, newEx, {at: [i]});
          Transforms.removeNodes(editor, {at: [i]});
          Transforms.insertNodes(editor, newEx, {at: [i], select: true});

        } else {
          // Remove elements that are not exercises
        }
      }
      console.log("___________");
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    return normalizeNode([entry, path]);
  };
  return editor;
}

export default App;
