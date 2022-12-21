import { MAX_PAWN_MOVES, Piece, Position } from "../Constants";

export default class Referee {

    isBlocked(x: number, y: number, board: Piece[]): boolean{
        const place = board.find((p) => p.position.x === x && p.position.y === y);

        if (place) {
            return true;
        } else {
            return false;
        }
    }

    isBlockedSamePiece(x: number, y: number, board: Piece[], color: string): boolean{
        const place = board.find((p) => p.position.x === x && p.position.y === y && p.color === color);

        if (place) {
            return true;
        } else {
            return false;
        }
    }


    isValidMove(prevX: number, prevY: number, x: number, 
        y: number, color: string, boardState: Piece[]) {
        console.log("Checking moves");
        if (x < 0 || x >= 6 || y < 0 || y > 5) {
            return false;
        }

        if (color === "white-pawn") {
            if (y - prevY === 1) {
                if (Math.abs(prevX - x) === 0) {
                    if (!this.isBlocked(x, y, boardState)) {
                        //console.log("hello")
                        return true;
                    }
                } else if (Math.abs(prevX - x) === 1) {
                    return !this.isBlockedSamePiece(x, y, boardState, color);
                }
                
            }
        } else {
            if (y - prevY === -1) {
                if (Math.abs(prevX - x) === 0) {
                    if (!this.isBlocked(x, y, boardState)) {
                        //console.log("hello")
                        return true;
                    }
                } else if (Math.abs(prevX - x) === 1) {
                    return !this.isBlockedSamePiece(x, y, boardState, color);
                }
                
            }
        }
        return false;
    }

    getValidMoves(piece: Piece, board: Piece[]) : Position[] {
        const posibleMoves: Position[] = [];

        if (piece.color === "white-pawn") {
            for (let i = 0; i < MAX_PAWN_MOVES; i++) {
                if (this.isValidMove(piece.position.x, 
                    piece.position.y, piece.position.x + i - 1, 
                    piece.position.y + 1, piece.color, board)) {

                    posibleMoves.push({x: piece.position.x + i - 1,
                        y: piece.position.y + 1})
                }
            }
        } else {
            for (let i = 0; i < MAX_PAWN_MOVES; i++) {
                if (this.isValidMove(piece.position.x, 
                    piece.position.y, piece.position.x + i - 1, 
                    piece.position.y - 1, piece.color, board)) {

                    posibleMoves.push({x: piece.position.x + i - 1,
                        y: piece.position.y - 1})
                }
            }
        }
        return posibleMoves;
    }
}