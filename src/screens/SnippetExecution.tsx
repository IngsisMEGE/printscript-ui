import {OutlinedInput} from "@mui/material";
import {highlight, languages} from "prismjs";
import Editor from "react-simple-code-editor";
import {Bòx} from "../components/snippet-table/SnippetBox.tsx";
import {useEffect, useState} from "react";
import {executionRequests} from "../utils/executionRequests";

type SnippetExecutionProps = {
    id: string;
    setRunSnippet: (isRunning: boolean) => void;
    runSnippet: boolean;
    language: string;
};

export const SnippetExecution = ({ id, setRunSnippet, runSnippet, language }: SnippetExecutionProps) => {
  const [input, setInput] = useState<string>("");
  const [inputList, setInputList] = useState<string[]>([]);
  const [output, setOutput] = useState<string>("");
  const execution = new executionRequests();

  useEffect(() => {
    if (runSnippet) {
        setOutput("");
          execute();
      } else {
        setInputList([]);
      }
  },[runSnippet]);

  const handleEnter = (event: { key: string }) => {
    if (event.key === 'Enter') {
        setInputList(prevInputs => [...prevInputs, input]);
        execute();
    }
  };

  const execute = () => {
      execution.executeSnippet(id, inputList, language).then(response => {
          const snippetResponse = response.data;
          setOutput(snippetResponse.output);
          if (!snippetResponse.doesItNeedInput){
              setInputList([]);
              setRunSnippet(false);
          }
      }).catch(error => {
          setOutput(error.response.data.output);
          setRunSnippet(false);
      });

      setInput("");
  }

    return (
      <>
        <Bòx flex={1} overflow={"none"} minHeight={200} bgcolor={'black'} color={'white'} code={output}>
            <Editor
              value={output}
              padding={10}
              onValueChange={(code) => setInput(code)}
              highlight={(code) => highlight(code, languages.js, 'javascript')}
              maxLength={1000}
              style={{
                  fontFamily: "monospace",
                  fontSize: 17,
              }}
            />
        </Bòx>
        <OutlinedInput onKeyDown={handleEnter} value={input} onChange={e => setInput(e.target.value)} placeholder="Type here" fullWidth/>
      </>
    )
}