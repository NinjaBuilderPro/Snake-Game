import { create } from "domain";
import { Dir } from "fs";
import { Cell } from "./cell";
import CellItem from "./cellItem";
import Collision from "./collistion";
import Coordinate from "./coordinate";
import Direction from "./direction";
import { IBoardHelper, ISnake } from "./iStudentCode";

export class BoardHelper implements IBoardHelper {
    /**
     * Get the grid size
     * @returns the number of cells for the square grid's size
     */
    getGridSize(): number {
        return 10;
    }

    /**
     * Gets the millisecond frame update period. Smaller numbers will increase the speed of the game
     * @returns the millisecond refresh rate
     */
    getRefreshRateMs(): number {
        return 500;
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.ceil(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**
     * Create a new apple cell item, which will be displayed on the board
     * @param freeCells the cells that are currently not occupied
     * @returns the new cell item
     */
    createApple(freeCells: Coordinate[]): CellItem {
        return new CellItem(freeCells[this.getRandomInt(0, freeCells.length - 1)], 'red');
    }

    /**
     * Processes a keyboard event and potentially returns a direction
     * @param keyBoardEvent the event to process. See for more details: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
     * @returns the associated direction, or null if not an accepted key code
     */
    getDirection(keyBoardEvent: KeyboardEvent): Direction | null {
        switch(keyBoardEvent.code) {
            case "KeyW":
                return Direction.UP;
            case "KeyA":
                return Direction.LEFT;
            case "KeyS":
                return Direction.DOWN;
            case "KeyD":
                return Direction.RIGHT;
        }
        return null;
    }
}

export class Snake implements ISnake {
    protected snakeHead = new CellItem(new Coordinate(5, 5), 'yellow');
    protected snakeBody: CellItem[] = this.createBody(4, 5);
    createBody(x: number, y: number): CellItem[] {
        return [new CellItem(new Coordinate(x, y), 'blue'), new CellItem(new Coordinate(x - 1, y), 'blue')]
    }
    /**
     * @returns the Snake Head Cell Item
     */
    getSnakeHead(): CellItem {
        return this.snakeHead;
    }

    /**
     * @returns the Snake Body Cell Items (not including the Snake Head) 
     */
    getSnakeBodyParts(): CellItem[] {
        return this.snakeBody;
    }

    /**
     * @returns all the Snake Cell Items
     */
    getAllSnakeParts(): CellItem[] {
        return [this.snakeHead].concat(this.getSnakeBodyParts());
    }

    /**
     * Handles moving the snake in a certain direct
     * @param direction the diection to move the snake in
     */
    update(direction: Direction): void {
            let tempFrontCoord = Object.assign({}, this.getSnakeHead().coordinate);
            let tempBackCoord = Object.assign({}, this.snakeBody[0].coordinate);
            switch(direction) {
                case Direction.UP:
                    this.snakeHead.coordinate.y++;
                    break;
                case Direction.DOWN:
                    this.snakeHead.coordinate.y--;
                    break;
                case Direction.LEFT:
                    this.snakeHead.coordinate.x--;
                    break;
                case Direction.RIGHT:
                    this.snakeHead.coordinate.x++;
                    break;
            }

            for(let i = 0; i < this.getSnakeBodyParts().length; i++) {
                tempBackCoord.x = this.snakeBody[i].coordinate.x
                tempBackCoord.y = this.snakeBody[i].coordinate.y

                this.snakeBody[i].coordinate.x = tempFrontCoord.x;
                this.snakeBody[i].coordinate.y = tempFrontCoord.y;

                tempFrontCoord.x = tempBackCoord.x;
                tempFrontCoord.y = tempBackCoord.y;
            }
    }

    /**
     * Detects if the snake is colliding with any obstacles or other Cell Items
     * @param gridSize the size of the grid
     * @param appleLocation the location of the apple
     * @returns the collision type or null if no collision
     */
    detectCollision(gridSize: number, appleLocation: Coordinate): Collision | null {
        if(this.snakeHead.coordinate.x == appleLocation.x && this.snakeHead.coordinate.y == appleLocation.y) {
            return Collision.APPLE
        }
        let snakeCollideWithWall = this.snakeHead.coordinate.x >= gridSize || this.snakeHead.coordinate.x < 0 || this.snakeHead.coordinate.y < 0 || this.snakeHead.coordinate.y >= gridSize;
        if(snakeCollideWithWall) {
            return Collision.WALL
        }
        for(let i = 0; i < this.getSnakeBodyParts().length; i++) {
            if(this.snakeHead.coordinate.x == this.snakeBody[i].coordinate.x && this.snakeHead.coordinate.y == this.snakeBody[i].coordinate.y){
                return Collision.SNAKE
            }
        }
        return null;
    }

    /**
     * Handles the consumption of an apple, which should add a new body part
     */
    consumeApple(): void {
        let last = this.snakeBody[this.snakeBody.length - 1];
        let nextToLast = this.snakeHead
        if(this.snakeBody.length > 1) {
            nextToLast = this.snakeBody[this.snakeBody.length - 2];
        }

        let xDiff = last.coordinate.x - nextToLast.coordinate.x;
        let yDiff = last.coordinate.y - nextToLast.coordinate.y;

        let newX = last.coordinate.x + xDiff
        let newY = last.coordinate.y + yDiff

        this.snakeBody.push(new CellItem(new Coordinate(newX, newY), 'blue'));
    }

}
