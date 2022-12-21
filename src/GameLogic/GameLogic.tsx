import { useState } from "react";
import Board from "../components/Board/Board";
import Promt from "../components/Modal/Promt";
import { HORIZONTAL, MAX_PAWN_MOVES, Piece, Position, samePosition, VERTICAL } from "../Constants";





export default function GameLogic() {
    
    function resetState() {
        const initialBoard: Piece[] = [];
    
        //fill the board with pawn
        for (let i = 0; i < HORIZONTAL.length; i++) {
            for (let j = 0; j < VERTICAL.length; j++) {
                if ((j >=0 && j <= 1)) {
                    initialBoard.push({image: "assets/images/pawn_w.png", position: {x: i, y: j}, color: "white-pawn"})
                } else if ((j >= VERTICAL.length - 2 && j <= VERTICAL.length - 1)) {
                    initialBoard.push({image: "assets/images/pawn_b.png", position: {x: i, y: j}, color: "black-pawn"})
                }
            }
        }
        return initialBoard;
    }

    function reset() {
        const initialBoard: Piece[] = resetState();
        setPieces(initialBoard);
    }

    const initialBoard: Piece[] = resetState();
    
    const [pieces, setPieces] = useState<Piece[]>(initialBoard);

    

    function getPossibleMoves() {
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = getValidMoves(p, currentPieces);
                return p;
            });
        });
    }

    function playMove(currPiece: Piece, newPosition: Position) : boolean {
        const x = currPiece.position.x
        const y = currPiece.position.y;
        const validMove = isValidMove(x, y, newPosition.x,
            newPosition.y, currPiece.color, pieces);

        if (validMove) {
            const updatePieces = pieces.reduce((results, pieceIn) => {
                if (samePosition(pieceIn.position, {x, y})) {
                    console.log(currPiece.position,"top");
                    pieceIn.position.x = newPosition.x;
                    pieceIn.position.y = newPosition.y;
                    
                    results.push(pieceIn);
                } else if (!(samePosition(pieceIn.position, newPosition))) {
                    console.log(pieceIn.position);
                    results.push(pieceIn);
                }
                return results;
            }, [] as Piece[]);

            setPieces(updatePieces);
        } else {
            return false;
        }
        return true;
    }

    function getValidMoves(piece: Piece, board: Piece[]) : Position[] {
        const posibleMoves: Position[] = [];

        if (piece.color === "white-pawn") {
            for (let i = 0; i < MAX_PAWN_MOVES; i++) {
                if (isValidMove(piece.position.x, 
                    piece.position.y, piece.position.x + i - 1, 
                    piece.position.y + 1, piece.color, board)) {

                    posibleMoves.push({x: piece.position.x + i - 1,
                        y: piece.position.y + 1})
                }
            }
        } else {
            for (let i = 0; i < MAX_PAWN_MOVES; i++) {
                if (isValidMove(piece.position.x, 
                    piece.position.y, piece.position.x + i - 1, 
                    piece.position.y - 1, piece.color, board)) {

                    posibleMoves.push({x: piece.position.x + i - 1,
                        y: piece.position.y - 1})
                }
            }
        }
        return posibleMoves;
    }

    function isValidMove(prevX: number, prevY: number, x: number, 
        y: number, color: string, boardState: Piece[]) {
        //console.log("Checking moves");
        if (x < 0 || x >= 6 || y < 0 || y > 5) {
            return false;
        }

        if (color === "white-pawn") {
            if (y - prevY === 1) {
                if (Math.abs(prevX - x) === 0) {
                    if (!isBlocked(x, y, boardState)) {
                        //console.log("hello")
                        return true;
                    }
                } else if (Math.abs(prevX - x) === 1) {
                    return !(isBlockedSamePiece(x, y, boardState, color));
                }
                
            }
        } else {
            if (y - prevY === -1) {
                if (Math.abs(prevX - x) === 0) {
                    if (!isBlocked(x, y, boardState)) {
                        //console.log("hello")
                        return true;
                    }
                } else if (Math.abs(prevX - x) === 1) {
                    return !(isBlockedSamePiece(x, y, boardState, color));
                }
                
            }
        }
        return false;
    }

    function isBlocked(x: number, y: number, board: Piece[]): boolean{
        const place = board.find((p) => p.position.x === x && p.position.y === y);

        if (place) {
            return true;
        } else {
            return false;
        }
    }

    function isBlockedSamePiece(x: number, y: number, board: Piece[], color: string): boolean{
        const place = board.find((p) => p.position.x === x && p.position.y === y && p.color === color);

        if (place) {
            return true;
        } else {
            return false;
        }
    }



    return (
    <>  
        <Promt reset={reset}/>
        <Board getPossibleMoves={getPossibleMoves} 
            playMove={playMove}
            pieces={pieces}
        />
    </>
    );
}