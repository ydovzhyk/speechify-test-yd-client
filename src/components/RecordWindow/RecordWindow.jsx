import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSocket from "../../useSocket";
import useAudioRecorder from "../../useAudioRecorder";
import AudioVisualizer from "../Shared/AudioVisualizer/AudioVisualizer";
import { getTextArray, getRecBtn } from "@/redux/technical/technical-selectors";
import {
  setNotifacation,
  setConfirmation,
  setRecBtn,
  clearTextArray,
  addLetter,
} from "@/redux/technical/technical-slice";
import logo from "../../images/logo.svg";

import s from "./RecordWindow.module.scss";

const RecordWindow = () => {
  const dispatch = useDispatch();
  const isRecBtn = useSelector(getRecBtn);
  const { initialize, disconnect, sendAudio } = useSocket();
  const {
    startRecording,
    stopRecording,
    isRecording,
    audioContext,
    sourceNode,
  } = useAudioRecorder({
    dataCb: (audioData, sampleRate) => sendAudio(audioData, sampleRate),
  });

  const textArray = useSelector(getTextArray);
  const textareaRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [prevTextArrayLength, setPrevTextArrayLength] = useState(0);
  const indexRef = useRef(0);

  const secondTextareaRef = useRef(null);
  const [copiedText, setCopiedText] = useState("");
  const [secondTextareaText, setSecondTextareaText] = useState("");
  const [isOperatonBtnActive, setIsOperatonBtnActive] = useState(false);

  useEffect(() => {
    if (prevTextArrayLength < textArray.length) {
      setPrevTextArrayLength(textArray.length);
    }
  }, [textArray]);

  useEffect(() => {
    if (indexRef.current < textArray.length) {
      const timer = setTimeout(() => {
        setTypedText((prevText) => prevText + textArray[indexRef.current - 1]);
        indexRef.current += 1;
      }, 40);

      return () => clearTimeout(timer);
    }
  }, [typedText, prevTextArrayLength]);

  useEffect(() => {
    const handlePaste = (e) => {
      setIsOperatonBtnActive(false);
    };
    const secondTextarea = secondTextareaRef.current;
    secondTextarea.addEventListener("paste", handlePaste);
    return () => {
      secondTextarea.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    const handleCopy = (e) => {
      setIsOperatonBtnActive(true);
    };
    const textarea = textareaRef.current;
    textarea.addEventListener("copy", handleCopy);
    return () => {
      textarea.removeEventListener("copy", handleCopy);
    };
  }, []);

  const handleRecord = async () => {
    if (!isRecording) {
      initialize();
      await startRecording();
      dispatch(setNotifacation(true));
    } else {
      await stopRecording();
      dispatch(addLetter("\n"));
      dispatch(setRecBtn(false));
      dispatch(setNotifacation(false));
      dispatch(setConfirmation(false));
    }
  };

  const handleTextChange = (value, param) => {
    if (param === "first") {
      setTypedText(value);
    } else {
      setSecondTextareaText(value);
    }
  };

  const handleOperaton = () => {
    if (!isOperatonBtnActive) {
      const textarea = textareaRef.current;
      const selectedText = textarea.value.substring(
        textarea.selectionStart,
        textarea.selectionEnd
      );
      setCopiedText(selectedText);
      navigator.clipboard.writeText(selectedText); //When copied using the button Copy but pasted through CTRL + V
      setIsOperatonBtnActive(true);
    } else {
      setSecondTextareaText(secondTextareaText + copiedText);
      setIsOperatonBtnActive(false);
    }
  };

  const handleClear = () => {
    setTypedText("");
    setPrevTextArrayLength(0);
    indexRef.current = 0;
    setCopiedText("");
    setSecondTextareaText("");
    setIsOperatonBtnActive(false);
    dispatch(clearTextArray());
  };

  return (
    <div className={s.recordWindow}>
      <div className={s.wrapper}>
        <div className={s.windowContent}>
          <div className={s.namePart}>
            <img src={logo} alt="Logo" className={s.logo} />
            <p className={s.name}>Voice Notes</p>
          </div>
          <div className={s.audioVisualizer}>
            <AudioVisualizer
              audioContext={audioContext}
              sourceNode={sourceNode}
            />
            {isRecBtn && (
              <div className={s.recordingButton}>
                <span className={s.recordingText}>REC</span>
              </div>
            )}
          </div>
          <textarea
            id="transcription-display"
            ref={textareaRef}
            className={s.windowText}
            rows="7"
            placeholder="Start to record your text..."
            value={typedText}
            onChange={(e) => handleTextChange(e.target.value, "first")}
          ></textarea>
          <textarea
            id="copiedText-display"
            ref={secondTextareaRef}
            className={s.windowText}
            rows="5"
            placeholder="Paste your copied text here..."
            value={secondTextareaText}
            onChange={(e) => handleTextChange(e.target.value, "second")}
          ></textarea>
          <div className={s.btnWrapper}>
            <button id="record-button" className={s.btn} onClick={handleRecord}>
              {!isRecording ? "Start Recording" : "Stop Recording"}
            </button>
            <button id="copy-button" className={s.btn} onClick={handleOperaton}>
              {!isOperatonBtnActive ? "Copy text" : "Paste text"}
            </button>
            <button id="reset-button" className={s.btn} onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordWindow;
