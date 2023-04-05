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

// Enable undo/redo actions
import { withHistory } from 'slate-history';

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps, DefaultLeaf } from "slate-react";
import { Exercise, Question, Solution, Paragraph, CustomElement } from "./react-app-env";
import { group } from "console";

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
    // withHtml(
      withHistory(withCustomNormalization(withReact(createEditor())))
      // )
  );

  const renderLeaf = useCallback((props: RenderLeafProps) => <DefaultLeaf {...props} />, []);
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
            {props.children}
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
            {props.children}
          </div>
        );
      case "code":
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        );
      case "paragraph":
        return (
          <div
            style={{
              border: "pink solid 1px",
              borderRadius: "2px",
              padding: "0.3em",
              marginBottom: "0.2em"
            }}
            {...props.attributes}
          >
            {props.children}
          </div>
        );
      case "solution":
        return (
          <div
            style={{
              border: "green solid 1px",
              borderRadius: "2px",
              padding: "0.3em",
              marginBottom: "0.2em"
            }}
            {...props.attributes}
          >
            {props.children}
          </div>
        );
    }
  }, []);

  return (
    <div style={{padding: "2em"}}>
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
    </div>
  );
}

function addMissing(exercise: Exercise): [boolean, Exercise] {
  var question: Question = emptyQ;
  var solution: Solution = emptyS;
  var changed: boolean = false;

  // empty exercise
  if (exercise.children.length === 0)
    changed = true;

  // 1 missing field
  if (exercise.children.length === 1) {
    if (exercise.children[0].type === 'question') {
      question = exercise.children[0];
    } else {
      solution = exercise.children[0];
    }
    changed = true;
  }

  let newExercise: Exercise = {
    type: 'exercise',
    children: [question, solution],
  }

  return [changed, newExercise];
}

function liftNestedElementsUp(exercise: Exercise): [boolean, Exercise[]] {
  let newEx: Exercise = {type: 'exercise', children: []};
  let finalExList: Exercise[] = [];
  let changed: boolean = false;
  
  for (let i=0; i<exercise.children.length; i++) {
    const child = exercise.children[i];
    const child_type = child.type;

    // Split elements by type
    const groups = child.children.reduce<(Paragraph[]|Exercise[]|Solution[]|Question[])[]>(
      (acc, current, index, array) => {
        if (index === 0) {
          return [[current]];
        }
        // Same type, add to previous group
        let current_list = acc[acc.length - 1];
        if (isArrayOfType(current.type, current_list)) {
          current_list.push(current);
        } else { // Different type, create new group
          acc.push([current]);
        }
        return acc;
      },
      [[]]
    );
 
    for (let g=0; g<groups.length; g++) {
      let group = groups[g];
      // Add paragraph sections back
      if (isArrayOfType('paragraph', group)) {
        const paragraphs: Paragraph[] = group;
        switch(child_type) {
          case 'question':
          case 'solution':
            newEx.children.push({type: child_type, children: paragraphs});
            break;
          default:
            break;
        }
      } else { // Lift nested elements up
          for (let e=0; e<group.length; e++) {
            const child = group[e];
            // Add elements to the current exercise
            if (child.type === 'question' || child.type === 'solution') {
              newEx.children.push({type: child.type, children: child.children});
            } else if (child.type === 'exercise') {
              // Insert new exercise in list
              if (newEx.children.length !== 0) {
                finalExList.push(newEx);
                newEx = {type: 'exercise', children: []};
              }
              // Lift exercise out of exercise element
              finalExList.push(child);
            }
          }
        changed = true;
      }
    }
  }

  if (newEx.children.length !== 0)
    finalExList.push(newEx);

  return [changed, finalExList];
}

function splitExWithExtraElements(ex: Exercise): [boolean, Exercise[]] {
  let finalExList: Exercise[] = [];
  let newEx: Exercise = {type: 'exercise', children: []};

  ex.children.forEach(elem => {
    switch(elem.type) {
      case 'question':
        // For when pasting text introduces additional question fields
        if (newEx.children.length !== 0) {
          finalExList.push(newEx);
          newEx = {type: 'exercise', children: []};
        }
        newEx.children.push(elem);
        break;
      case 'solution':
        newEx.children.push(elem);
        finalExList.push(newEx);
        newEx = {type: 'exercise', children: []};
        break;
    }
  });

  if (newEx.children.length !== 0)
    finalExList.push(newEx);

  return [finalExList.length !== 0, finalExList];
}

function prettyPrintEditor(elems: Descendant[], spacing=0) {
  for (let i=0; i<elems.length; i++) {
    const elem: Descendant = elems[i];
    const isTextNode = elem.type === 'text';
    let textContent = '';
    if (isTextNode) {
      textContent = elem.text;
    }
    console.log(Array(spacing + 1).join(" ") + "type: " + elems[i].type + ": " + textContent)
    if (!isTextNode)
      prettyPrintEditor(elem.children, spacing + 4)
  }
}

function withCustomNormalization(editor: Editor) {
  let { normalizeNode } = editor;

  editor.normalizeNode = ([entry, path]) => {
    if (path.length === 0) {
      let finalExList: Exercise[] = [];
      prettyPrintEditor(editor.children);

      console.log("___________");
      // Check that all elements are exercises
      for (let i = 0; i < editor.children.length; i++) {
        console.log("- " + i + ": " + editor.children[i].type);
        const element = editor.children[i];
        if (element.type === "exercise") {
          // Check exercise composition
          // Pull nested elements up
          let [changed, newExList] = liftNestedElementsUp(element);
          let newEx: Exercise;
          if (!changed)
            newExList = [element];

          // Split exercises with extra nodes
          let splitExList: Exercise[] = [];
          newExList.forEach(ex => {
            let [changed, splitted] = splitExWithExtraElements(ex);
            if (!changed)
              splitted = [ex];
            splitted.forEach(ex => splitExList.push(ex));
          });
          newExList = splitExList;

          // Check for missing elements
          newExList.forEach(ex => {
            [changed, newEx] = addMissing(ex);
            if (!changed)
              newEx = ex;
            finalExList.push(newEx);
          });
        }
      }
      if (finalExList.length !== 0)
        editor.children = finalExList;
      console.log(editor.children);
      console.log("___________");
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    return normalizeNode([entry, path]);
  };
  return editor;
}

function isArrayOfType<A extends CustomElement["type"]>(type: A, value: {type: string}[]): value is { type: A }[] {
  return value.every(v => v.type === type)
}

export default App;
