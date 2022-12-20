import { Piece } from "../Constants";

export default class Referee {

    isBlocked(x: number, y: number, board: Piece[]): boolean{
        // console.log(board.length)
        // board.forEach((p) => {
        //     if (p.x === x && p.y === y) {
        //         return true;
        //     }
        // });
        // return false;

        const place = board.find((p) => p.x === x && p.y === y);

        if (place) {
            return true;
        } else {
            return false;
        }
    }

    isBlockedSamePiece(x: number, y: number, board: Piece[], color: string): boolean{
        // console.log(board.length)
        // board.forEach((p) => {
        //     if (p.x === x && p.y === y) {
        //         return true;
        //     }
        // });
        // return false;

        const place = board.find((p) => p.x === x && p.y === y && p.color === color);

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
}