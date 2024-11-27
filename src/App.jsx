import React, { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 10; // Size of the grid
const INITIAL_SNAKE = [{ x: 3, y: 2 }];
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [food, setFood] = useState({ x: 7, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (DIRECTIONS[e.key]) {
        setDirection(DIRECTIONS[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      // Check for collisions with walls
      if (head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || head.x < 0 || head.y < 0) {
        setIsGameOver(true);
        return;
      }

      // Check for collisions with itself
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Check if snake eats the food
      if (head.x === food.x && head.y === food.y) {
        setScore(score + 1);
        // Generate new food
        setFood({
          x: Math.floor(Math.random() * BOARD_SIZE),
          y: Math.floor(Math.random() * BOARD_SIZE),
        });
      } else {
        newSnake.pop(); // Remove the tail
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, 200);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food, isGameOver, score]);

  return (
    <div className="game-container">
      {isGameOver ? (
        <div className="game-over">Game Over! Your score: {score}</div>
      ) : (
        <div className="game-board">
          {[...Array(BOARD_SIZE)].map((_, rowIndex) => (
            <div key={rowIndex} className="row">
              {[...Array(BOARD_SIZE)].map((_, colIndex) => {
                const isSnakeSegment = snake.some(segment => segment.x === colIndex && segment.y === rowIndex);
                const isFood = food.x === colIndex && food.y === rowIndex;

                return (
                  <div
                    key={colIndex}
                    className={`cell ${isSnakeSegment ? "snake" : ""} ${isFood ? "food" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
