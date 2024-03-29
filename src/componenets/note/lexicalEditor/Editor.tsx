import { useState, useEffect } from "react";
import { useStore } from "../../../store/notebooks";
import { NoteType } from "../../../type/notebookTypes";
import { OnChangePlugin, InitPlugin } from "./customPlugin";
import styled from "styled-components";

import { EditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const Editor = ({ note }: { note: NoteType }) => {
  const { saveNote } = useStore();

  const [editorState, setEditorState] = useState(""); // JSON 형태로 저장된 editorState(현재 에디터의 글)
  const [titleNode, setTitleNode] = useState<string | null>();
  const [isModified, setIsModified] = useState(false);

  const onChange = (editorState: EditorState) => {
    setIsModified(false);

    // console.log("editorState", editorState);
    // _EditorState(editor의 contents)를 editorState에 JSON 형태로 저장
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));

    // editorState의 제목은 첫번째 textNode
    const textNodes = Array.from(editorState._nodeMap.values()).filter(
      node => node.__type === "text",
    );
    const titleNode = textNodes[0]?.__text ?? null;
    setTitleNode(titleNode);
  };

  const onSave = () => {
    if (note.id && titleNode && editorState) {
      saveNote(note.id, titleNode, editorState);
    }
  };

  // editor에 사용자의 입력이 멈추고 3초 후 isModified를 true로 설정
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsModified(true);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [editorState]);

  // isModified가 true가 되면 auto save
  useEffect(() => {
    if (isModified && titleNode !== "" && editorState !== "") {
      onSave();
    }
  }, [isModified]);

  const initialConfig = {
    namespace: "MyNoteEditor",
    theme: { paragraph: "editor-paragraph" },
    onError(error: Error) {
      console.log(error);
    },
  };

  return (
    <EditorWrapper className="note-item">
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={<ContentEditable className="contentEditable" />}
          placeholder={<div className="placeholder">Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
        <InitPlugin note={note} />
      </LexicalComposer>
    </EditorWrapper>
  );
};

const EditorWrapper = styled.div`
  overflow-y: auto;
  position: relative;
  padding: 12px 20px;

  & .contentEditable {
    width: 100%;
    height: 100%;
    outline: none;

    & .editor-paragraph {
      & > span:nth-of-type(1) {
        display: inline-block;
        padding: 16px 0;
        font-size: 2.2rem;
        font-weight: 600;
      }
    }
  }

  & .placeholder {
    position: absolute;
    /* top: 28px; */
    top: 12px;
    color: var(--color-gray);
    /* font-size: 2.2rem; */
  }
`;

export default Editor;
