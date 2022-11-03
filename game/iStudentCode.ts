/**
 * STUDENTS SHOULD NOT TOUCH THIS FILE FOR THE EXERCISES
 * (They may improve it after the exercise is done)
 */

import CellItem from "./cellItem";
import Collision from "./collistion";
import Coordinate from "./coordinate";
import Direction from "./direction";

export interface IBoardHelper {
    getGridSize(): number;
    getRefreshRateMs(): number;
    getDirection(keyBoardEvent: KeyboardEvent): Direction | null;
    createApple(freeCells: Coordinate[]): CellItem;
}

export interface ISnake {
    getSnakeHead(): CellItem;
    getSnakeBodyParts(): CellItem[];
    getAllSnakeParts(): CellItem[];
    update(direction: Direction): void;
    detectCollision(gridSize: number, appleLocation: Coordinate): Collision | null;
    consumeApple(): void;
    updateSnakePartBackground(snakePart: CellItem, indexInSnake: number, lastDirection: Direction): string;
}
