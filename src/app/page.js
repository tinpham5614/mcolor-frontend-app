"use client";
import React, { useReducer, useEffect, useMemo } from "react";
import Shape from "./components/Shape";
import generateRandomCombinations from "./utils/generateRandomCombinations";
import "@/app/styles/index.css";
import { useStopwatch } from "react-timer-hook";
import Feedback from "./components/Feedback";

const BASE_TIME = 5;

const initialState = {
  level: 1,
  timeLeft: BASE_TIME,
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
        timeLeft: BASE_TIME,
        feedback: "Correct! 🎉",
        playerSequence: [],
      };
    case "RESET_LEVEL":
      return {
        ...state,
        level: 1,
        timeLeft: BASE_TIME,
        combinations: action.payload,
        feedback: "Incorrect! 🤔",
        playerSequence: [],
      };
    case "SET_TIME_LEFT":
      return { ...state, timeLeft: action.payload };
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
    timeLeft,
    combinations,
    randomCombinations,
    playerSequence,
    highestScore,
    feedback,
  } = state;

  const { seconds, minutes, start, pause, reset, isRunning } = useStopwatch({
    autoStart: false,
  });

  useEffect(() => {
    const newCombinations = generateRandomCombinations(level + 1);
    dispatch({ type: "SET_COMBINATIONS", payload: newCombinations });
  }, [level]);

  // Timer Effect
  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_TIME_LEFT", payload: timeLeft - 1 });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, isRunning]);

  const shuffledCombinations = useMemo(() => {
    return combinations
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }, [combinations]);

  useEffect(() => {
    dispatch({
      type: "SET_RANDOM_COMBINATIONS",
      payload: shuffledCombinations,
    });
  }, [shuffledCombinations]);

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
    const updatedSequence = [];
    dispatch({ type: "SET_PLAYER_SEQUENCE", payload: updatedSequence });
  };

  return (
    <div>
      <h1>mColor</h1>

      <div className="info-container">
        <h4>Highest Level: {highestScore}</h4>
        <h4>
          Timer: {minutes}m : {seconds}s
        </h4>
      </div>

      <Feedback feedback={feedback} />

      {timeLeft > 0 ? (
        <div className="shapes-container">
          {combinations.map((item, index) => (
            <Shape key={index} shape={item.shape} color={item.color} />
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

      <div className="timer">
        <p>{timeLeft > 0 && `Answer in ${timeLeft}`}</p>
      </div>
      <div
        className="timer-bar"
        style={{
          width: `${(timeLeft / BASE_TIME) * 100}%`,
          height: "10px",
          backgroundColor: "green",
          borderRadius: "50px",
        }}
      ></div>

      <div className="level-info">Level: {level}</div>

      <div className="shapes-container-random">
        {playerSequence.map((item, index) => (
          <Shape key={index} shape={item.shape} color={item.color} />
        ))}
        <div>
          {playerSequence.length !== 0 && (
            <button onClick={handleClearAnswer}>Clear</button>
          )}
        </div>
      </div>

      <div className="button-container">
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
