"use client";
import React, { useState, useReducer, useEffect, useMemo } from "react";
import Shape from "./components/Shape";
import generateRandomCombinations from "./utils/generateRandomCombinations";
import "@/app/styles/index.css";
import { useStopwatch } from "react-timer-hook";
import Feedback from "./components/Feedback";
import fisherYatesShuffle from "./utils/fisherYatesShuffle";

const initialState = {
  level: 1,
  isReady: false,
  combinations: [],
  randomCombinations: [],
  playerSequence: [],
  highestScore: 1,
  feedback: "",
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "SET_COMBINATIONS":
      return {
        ...state,
        combinations: action.payload,
      };
    case "SET_RANDOM_COMBINATIONS":
      return { ...state, randomCombinations: action.payload };
    case "SET_PLAYER_SEQUENCE":
      return { ...state, playerSequence: action.payload };
    case "ADVANCE_LEVEL":
      return {
        ...state,
        level: state.level + 1,
        highestScore: Math.max(state.highestScore, state.level + 1),
        isReady: false,
        feedback: "Correct! 🎉",
        playerSequence: [],
      };
    case "RESET_LEVEL":
      return {
        ...state,
        level: 1,
        isReady: false,
        combinations: action.payload,
        feedback: "Incorrect! 😕",
        playerSequence: [],
      };
    case "SET_READY":
      return { ...state, isReady: action.payload };
    case "RESET_GAME":
      return { ...initialState, combinations: action.payload };
    default:
      return state;
  }
};

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {
    level,
    isReady,
    combinations,
    randomCombinations,
    playerSequence,
    highestScore,
    feedback,
  } = state;

  const { seconds, minutes, start, pause, reset, isRunning } = useStopwatch({
    autoStart: false,
  });

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const newCombinations = generateRandomCombinations(level + 1);
    dispatch({ type: "SET_COMBINATIONS", payload: newCombinations });
  }, [level, setIsOpen]);

  // Set Ready
  const handleReadyClick = () => {
    if (isRunning) {
      dispatch({ type: "SET_READY", payload: true });
    }
  };
  const shuffledCombinations = useMemo(() => {
    return fisherYatesShuffle(combinations);
  }, [combinations]);

  useEffect(() => {
    if (isReady) {
      dispatch({
        type: "SET_RANDOM_COMBINATIONS",
        payload: shuffledCombinations,
      });
      setIsOpen(false);
    }
  }, [isReady, shuffledCombinations]);

  const handleShapeClick = (shape, color) => {
    const updatedSequence = [...playerSequence, { shape, color }];
    dispatch({ type: "SET_PLAYER_SEQUENCE", payload: updatedSequence });

    if (updatedSequence.length === combinations.length) {
      const isCorrect = updatedSequence.every(
        (item, index) =>
          item.shape === combinations[index].shape &&
          item.color === combinations[index].color
      );
      if (isCorrect) {
        dispatch({ type: "ADVANCE_LEVEL" });
      } else {
        const newCombinations = generateRandomCombinations(2);
        dispatch({ type: "RESET_LEVEL", payload: newCombinations });
      }
    }
  };

  const handleReset = () => {
    reset();
    const newCombinations = generateRandomCombinations(2);
    dispatch({ type: "RESET_GAME", payload: newCombinations });
  };

  const handleClearAnswer = () => {
    const updatedSequence = [...playerSequence.slice(0, -1)];
    dispatch({ type: "SET_PLAYER_SEQUENCE", payload: updatedSequence });
  };

  const handleStart = () => {
    start();
    setIsOpen(false);
  };

  return (
    <div>
      <div className="info-container">
        <div>
          <h4>Highest Level: {highestScore}</h4>
          <h4>
            Timer: {minutes}m : {seconds}s
          </h4>
          <p>{isRunning ? "Playing..." : "Not playing"}</p>
        </div>

        <div className="button-container">
          <button onClick={handleStart} disabled={true ? isRunning : false}>
            ▶︎ Start
          </button>
          <button onClick={pause}>⏸︎ Pause</button>
          <button onClick={handleReset}>↺ Reset</button>
        </div>
      </div>

      <Feedback feedback={`Level: ${level}`} />

      {!isReady ? (
        <div className="shapes-container">
          {combinations.map((item, index) => (
            <Shape
              key={index}
              shape={item.shape}
              color={item.color}
              onClick={handleReadyClick}
            />
          ))}
        </div>
      ) : (
        <div className="shapes-container-random">
          {randomCombinations.map((item, index) => (
            <Shape
              key={index}
              shape={item.shape}
              color={item.color}
              onClick={() => handleShapeClick(item.shape, item.color)}
            />
          ))}
        </div>
      )}

      <Feedback feedback={feedback} />

      <div className="shapes-container-random">
        {playerSequence.map((item, index) => (
          <Shape key={index} shape={item.shape} color={item.color} />
        ))}

        {playerSequence.length !== 0 && (
          <button onClick={handleClearAnswer}>⌫ Delete</button>
        )}
      </div>

      <dialog open={isOpen} className="dialog">
        <p>Quick guide:</p>
        <form method="dialog">
          <p>1. Click the &quot;Start&quot; button to start the game</p>
          <p>2. Click on any shapes to shuffle</p>
          <p>
            3. Select shapes in the correct order to move on to the next level
          </p>

          <button>OK</button>
        </form>
      </dialog>
    </div>
  );
}
