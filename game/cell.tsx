import { CSSProperties, FunctionComponent, useState } from "react";
import CellItem from "./cellItem";
import styles from '../styles/Board.module.css';
import Coordinate from "./coordinate";

export class Cell {
    constructor(public coodinate: Coordinate, private item?: CellItem) {}

    hasItem() {
        return !!this.item;
    }

    clearItem() {
        this.item = undefined;
        this.onChange();
    }

    setItem(item: CellItem) {
        this.item = item;
        this.onChange();
    }

    getItemBackground(): CSSProperties {
        const bg = this.item?.background;
        if (!this.item || !bg) {
            return {};
        }
        if (this.item.isBackgroundAColor()) {
            return {backgroundColor: bg};
        }
        return {backgroundImage: `url(${bg})`};
    }

    onChange = () => {};
}

export type CellProps = {
    cell: Cell;
}

export const CellComponent: FunctionComponent<CellProps> = (props) =>  {
    const [background, setBackground] = useState(props.cell.getItemBackground());

    props.cell.onChange = () => {
        setBackground(props.cell.getItemBackground());
    }

    const onClick = () => {
        console.log(props.cell);
    };

    return <div className={styles.square} onClick={onClick} style={background}></div>
}