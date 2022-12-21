export const HORIZONTAL = ["a", "b", "c", "d", "e", "f"];
export const VERTICAL = ["1", "2", "3", "4", "5", "6"];

export interface Position {
    x: number;
    y: number;
}

export interface Piece {
    image: string;
    position: Position;
    color: string;
    possibleMoves?: Position[];
}

export const GRID_SIZE = 134;
export const BOARD_SIZE = 804;
export const MAX_PAWN_MOVES = 3;

export function samePosition(p1: Position, p2: Position) {
    return p1.x === p2.x && p1.y === p2.y;
}

export interface player {
    isUp: boolean;
    isWhite: boolean;
}