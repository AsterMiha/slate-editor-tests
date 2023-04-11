/// <reference types="react-scripts" />

// TypeScript users only add this code
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = Paragraph | Code | Question | Solution | Exercise | Image;
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
  children: (Question | Solution)[];
}

interface Image {
  type: "image";
  url?: string;
  children: CustomText[];
}

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

interface Question {
  type: "question";
  children: (Paragraph | Image)[];
}
interface Solution {
  type: "solution";
  children: (Paragraph | Image) [];
}

type ExSection = Paragraph | Image;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
