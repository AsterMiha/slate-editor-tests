/// <reference types="react-scripts" />

// TypeScript users only add this code
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = Paragraph | Code | Question | Solution | Exercise;
type ExercisePart = Question | QuestionBody | Solution | SolutionBody;
type CustomText = { type: "text"; text: string };

interface Paragraph {
  type: "paragraph";
  children: CustomText[];
}
interface Code {
  type: "code";
  children: CustomText[];
}

interface Exercise {
  type: "exercise";
  // children: [Question, Solution];
  children: (Question | Solution)[];
}

// { "type": "exercise", "question": ..., "solutio": ... } -> { type: "exercise", children: [] }
// Dict <-> List of tuples


const example: Exercise = {
  type: "exercise",
  children: [
    {
      type: "question",
      children: [
        {
          type: "paragraph",
          children: [{ text: "What is the captial of Germany?" }],
        },
      ],
    },
    {
      type: "solution",
      children: [
        { type: "paragraph", children: [{ text: "Paragraph 1" }] },
        { type: "paragraph", children: [{ text: "Paragraph 1" }] },
      ],
    },
  ],
};

/*
Question title - 1 line
Question body - variable length
Solution title - 1 line
Solution body - variable length
*/
interface Question {
  type: "question";
  children: Paragraph[];
}
//interface QuestionBody { type: 'questionBody'; children: CustomText[] }
interface Solution {
  type: "solution";
  children: Paragraph[];
}
//interface SolutionBody { type: 'solutionBody'; children: CustomText[] }

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
