/**
 * STUDENTS SHOULD NOT TOUCH THIS FILE FOR THE EXERCISES
 * (They may improve it after the exercise is done)
 */

import { FunctionComponent, useEffect, useRef, useState } from "react";
import styles from '../styles/Board.module.css';
import { Cell, CellComponent } from "./cell";
import CellItem from "./cellItem";
import Collision from "./collistion";
import Coordinate from "./coordinate";
import Direction from "./direction";
import { BoardHelper, Snake } from "./studentCode";

const boardHelper = new BoardHelper();
const GridSize = boardHelper.getGridSize();

const gridIterator = (callback: (coordinate: Coordinate) => void) => {
    for (let y = GridSize - 1; y >= 0; y--) {
        for (let x = 0; x < GridSize; x++) {
            callback(new Coordinate(x, y));
        }
    }
}

class BoardManager {
    private snake = new Snake();
    private cells = new Map<string, Cell>();
    private direction = Direction.RIGHT;
    private apple: CellItem;

    constructor() {
        gridIterator(coordinate => this.cells.set(coordinate.getCoordinateKey(), new Cell(coordinate)));
        this.updateCells(this.direction, false);
        this.apple = this.createApple(); //Just getting around initialization error
    }

    createApple() {
        const freeCells = Array.from(this.cells.values()).filter(cell => !cell.hasItem()).map(cell => cell.coodinate.clone());
        this.apple = boardHelper.createApple(freeCells);
        this.getCell(this.apple.coordinate).setItem(this.apple);
        return this.apple;
    }

    getCell(coordinate: Coordinate) {
        const cell = this.cells.get(coordinate.getCoordinateKey());
        if (!cell) {
            console.error('FATAL ERROR: Index outside grid');
        }
        return cell ?? new Cell(coordinate);
    }

    update() {
        this.cells.forEach(cell => cell.clearItem());
        this.snake.update(this.direction);
        const collision = this.snake.detectCollision(GridSize, this.apple.coordinate);
        switch (collision) {
            case Collision.APPLE:
                this.snake.consumeApple();
                this.updateCells(this.direction, false);
                this.createApple();
                break;
            case Collision.WALL:
                return 'Your snake slithered into a wall!';
            case Collision.SNAKE:
                return 'Your snaked slithered into itself';
        }
        this.updateCells(this.direction);
        return null;
    }

    updateCells(direction: Direction, includeApple = true) {
        this.snake.getAllSnakeParts().forEach((item, index) => item.background = this.snake.updateSnakePartBackground(item, index, direction));
        this.snake.getAllSnakeParts().concat(includeApple ? [this.apple] : []).forEach(item => {
            const cell = this.getCell(item.coordinate);
            cell.setItem(item);
            cell.onChange();
        });
    }

    handleKeyBoardEvent(event: KeyboardEvent) {
        this.direction = boardHelper.getDirection(event) ?? this.direction;
    }
}

const Board: FunctionComponent = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOverText, setGameOverText] = useState('');
    const [gridSize, setGridSize] = useState(GridSize);
    const boardRef = useRef<HTMLHeadingElement>(null);
    const [boardManager, setBoardManager] = useState<BoardManager>(new BoardManager());

    useEffect(() => {
        window.document.onkeydown = event => {
            boardManager?.handleKeyBoardEvent(event);
        }
        setGridSize(GridSize);
    }, [boardManager])

    useEffect(() => {
        boardRef?.current?.style?.setProperty("--grid-size", gridSize.toString());
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if(!gameStarted) {
                return;
            }
            const gameOverMessage = boardManager.update();
            if(gameOverMessage) {
                setGameOverText(gameOverMessage);
                setGameStarted(false);
                setBoardManager(new BoardManager());
            }
        }, boardHelper.getRefreshRateMs());
        return () => clearInterval(interval);
    })

    const createCells = () => {
        let cells = [] as JSX.Element[];
        gridIterator(coordinate => {
            const cell = boardManager.getCell(coordinate);
            cells.push(<CellComponent cell={cell} key={coordinate.getCoordinateKey()}></CellComponent>)
        });
        return cells;
    };

    const startGame = () => {
        setBoardManager(new BoardManager());
        setGameStarted(true);
        boardManager?.update();
    }

    if (!gameStarted) {
        return (
            <div className={styles.wrapper}>
                {gameOverText ? (<h1>{gameOverText}</h1>) : <></>}
                <button onClick={startGame}>New Game</button>
            </div>
        )
    }

    return (
        <div className={styles.wrapper}>
            <div ref={boardRef} className={styles.board}>
                {createCells()}
            </div>
        </div>
    );
}

export default Board