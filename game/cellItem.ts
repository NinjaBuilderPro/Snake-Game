/**
 * STUDENTS SHOULD NOT TOUCH THIS FILE FOR THE EXERCISES
 * (They may improve it after the exercise is done)
 */

import Coordinate from "./coordinate";

export default class CellItem {
    /**
     * Passes data to be used to draw an item on the board
     * @param coordinate the x,y coordinate for the item
     * @param background the color or url to a background image
     */
    constructor(
        public coordinate: Coordinate,
        public background: string,
    ) {}

    isBackgroundAColor() {
        const style = new Option().style;
        style.color = this.background;
        return style.color === this.background;
    }
}
