import { create } from "zustand";
import { persist } from "zustand/middleware";

import { NotebookType } from "../type/notebookTypes";

// notebooks -> create, remove
// note -> create, remove, save

const value = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "안녕하세요. 이 부분은 제목입니다.",
            type: "text",
            version: 1,
          },
          { type: "linebreak", version: 1 },
          { type: "linebreak", version: 1 },
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "이 부분은 내용입니다.",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

const value2 = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "안녕하세요. 이 부분은 제목입니다.",
            type: "text",
            version: 1,
          },
          { type: "linebreak", version: 1 },
          { type: "linebreak", version: 1 },
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "22222이 부분은 내용입니다.",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

interface StoreType {
  notebooks: NotebookType[];
  // createNotebook
  // createNote
  // removeNote
  // saveNote
}

export const useStore = create<StoreType>()(
  persist(
    set => ({
      notebooks: [
        {
          id: 1,
          name: "notebook1",
          // cover: "lightblue",
          notelist: [
            { id: 11, title: "new note1", content: value, date: new Date() },
          ],
        },
        {
          id: 2,
          name: "notebook2",
          // cover: "lightcoral",
          notelist: [
            {
              id: 21,
              title: "첫번째노트타이틀",
              content: value,
              date: new Date(),
            },
            {
              id: 31,
              title: "두번째노트타이틀입니다.",
              content: value2,
              date: new Date(),
            },
            {
              id: 41,
              title: "세번째 노트타이틀입니다아아아아아",
              content: value,
              date: new Date(),
            },
          ],
        },
        {
          id: 3,
          name: "notebook3",
          // cover: "lightgreen",
          notelist: [],
        },
      ],
      // notebooks: [],
      createNotebook: name =>
        set(prev => ({
          notebooks: [
            ...prev.notebooks,
            {
              id: new Date().getMilliseconds(),
              name,
              notelist: [],
            },
          ],
        })),
      createNote: (notebookName, id, title, content, date) =>
        set(prev => {
          const updatedNotebooks = prev.notebooks.map(notebook => {
            if (notebook.name === notebookName) {
              return {
                ...notebook,
                notelist: [
                  {
                    id,
                    title,
                    content,
                    date,
                  },
                  ...notebook.notelist,
                ],
              };
            }

            return notebook;
          });

          return {
            notebooks: updatedNotebooks,
          };
        }),
      removeNote: noteId =>
        set(prev => {
          const updatedNotebooks = prev.notebooks.map(notebook => {
            return {
              ...notebook,
              notelist: notebook.notelist.filter(note => note.id !== noteId),
            };
          });

          return {
            notebooks: updatedNotebooks,
          };
        }),
      saveNote: (noteId, title, content) =>
        set(prev => {
          const updatedNotebooks = prev.notebooks.map(notebook => {
            return {
              ...notebook,
              notelist: notebook.notelist.map(note => {
                if (note.id === noteId) {
                  return {
                    ...note,
                    title,
                    content,
                  };
                }
                return note;
              }),
            };
          });

          return {
            notebooks: updatedNotebooks,
          };
        }),
    }),
    {
      name: "NOTE_APP_STORAGE",
    },
  ),
);