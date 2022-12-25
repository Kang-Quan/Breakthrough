import { useState } from "react";
import Board from "../components/Board/Board";
import Promt from "../components/Modal/Promt";
import { HORIZONTAL, MAX_PAWN_MOVES, Piece, Position, samePosition, VERTICAL } from "../Constants";





export default function GameLogic() {
    const initialBoard: Piece[] = resetState(true);
    const [pieces, setPieces] = useState<Piece[]>(initialBoard);

    function resetState(isWhite: boolean) {
        const initialBoard: Piece[] = [];
        //fill the board with pawn
        for (let i = 0; i < HORIZONTAL.length; i++) {
            for (let j = 0; j < VERTICAL.length; j++) {
                if (isWhite) {
                    if ((j >=0 && j <= 1)) {
                        initialBoard.push({image: "assets/images/pawn_w.png", position: {x: i, y: j}, color: "white-pawn"})
                    } else if ((j >= VERTICAL.length - 2 && j <= VERTICAL.length - 1)) {
                        initialBoard.push({image: "assets/images/pawn_b.png", position: {x: i, y: j}, color: "black-pawn"})
                    }
                } else {
                    //find the move
                    //get the prev and final coordinates: if at previous skip, push at final
                    //x = 0, y = 4  to x = 0, y = 3
                    if (i === 0 && j === 4) {
                        continue;
                    } else if ((j >=0 && j <= 1)) {
                        initialBoard.push({image: "assets/images/pawn_b.png", position: {x: i, y: j}, color: "white-pawn"})
                    } else if ((j >= VERTICAL.length - 2 && j <= VERTICAL.length - 1)) {
                        initialBoard.push({image: "assets/images/pawn_w.png", position: {x: i, y: j}, color: "black-pawn"})
                    } else if (i === 0 && j === 3) {
                        initialBoard.push({image: "assets/images/pawn_w.png", position: {x: i, y: j}, color: "black-pawn"})
                    }
                }
                
            }
        }
        return initialBoard;
    }

    function reset(isWhite: boolean) {
        const initialBoard: Piece[] = resetState(isWhite);
        setPieces(initialBoard);
    }

    
    //this returns all possible moves for every piece used for premove
    function getPossibleMoves() {
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = getValidMoves(p, currentPieces);
                return p;
            });
        });
    }

    //returns an array of positiion that is free for a single piece
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
            //for future use in case we want to have premove shown for black
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


    //This function moves a piece from previous position to the new position
    function playMove(currPiece: Piece, newPosition: Position) : boolean {
        // we can check if the final position is winning here
        const x = currPiece.position.x
        const y = currPiece.position.y;

        const xN = newPosition.x;
        const yN = newPosition.y;

        const validMove = isValidMove(x, y, newPosition.x,
            newPosition.y, currPiece.color, pieces);

        if (validMove) {
            const newPiece = [...pieces]
            console.log(newPiece)
            const updatePieces = newPiece.reduce((results, pieceIn) => {
                
                if (samePosition(pieceIn.position, {x, y})) {
                    //console.log(currPiece.position,"top");
                    
                    // console.log(xN, yN);
                    // pieceIn.position = {x: xN, y: yN};
                    results.push({image: pieceIn.image, position: newPosition, color: pieceIn.color});
                } else if (!(samePosition(pieceIn.position, {x: xN, y: yN}))) {
                    //console.log(pieceIn);
                    results.push(pieceIn);
                }
                return results;
            }, [] as Piece[]);
            
            const newArr: Piece[] = [...updatePieces]
            setPieces(() => newArr);
            //use api to get the moves
            //then call makeAMove
            //we will check the winning move in makeAMove
            //makeAMove({x: 1, y: 1}, {x: 0, y: 0}, newArr);
            //makeAMove({x: 0, y: 4}, {x: 0, y: 3}, newArr); 
            //makeAMove({x: 0, y: 3}, {x: 0, y: 2}, newArr);  
            makeAMove({x: 4, y: 4}, {x: 3, y: 3}, newArr); 
        } else {
            return false;
        }
        return true;
    }

    //This function check whether a move is valid
    function isValidMove(prevX: number, prevY: number, x: number, 
        y: number, color: string, boardState: Piece[]) {
        if (x < 0 || x >= 6 || y < 0 || y > 5) {
            return false;
        }
        
        if (color === "white-pawn") {
            if (y - prevY === 1) {
                if (Math.abs(prevX - x) === 0) {
                    if (!isBlocked(x, y, boardState)) {
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

    //a function to move a piece from a position to next position
    function makeAMove(prevPosition: Position, newPosition: Position, newerPiece: Piece[]) {
        
        const x = prevPosition.x;
        const y = prevPosition.y;

        const xN = newPosition.x;
        const yN = newPosition.y;
        const currPiece = newerPiece.find(p => samePosition(p.position, {x, y}))
        console.log(currPiece, "not null");
        
        const newPiece = [...newerPiece]
        const updatedPieces = newPiece.reduce((results, pieceIn) => {
            if (samePosition(pieceIn.position, {x, y})) {
                //console.log(currPiece.position,"top");
                //pieceIn.position.x = xN;
                //pieceIn.position.y = yN;
                //results.push(pieceIn);
                results.push({image: pieceIn.image, position: newPosition, color: pieceIn.color});
            } else if (!(samePosition(pieceIn.position, {x: xN, y: yN}))) {
                results.push(pieceIn);
            }
            return results;
        }, [] as Piece[]);
        const newArr = [...updatedPieces]
        setPieces(() => newArr);
        // const x = prevPosition.x;
        // const y = prevPosition.y;
        // const currPiece = newerPiece.find(p => samePosition(p.position, {x, y}))
        // console.log(currPiece, "issue");
        
        // if (currPiece) {
        //     playMove(currPiece, newPosition);
        // }
    }

    //This function check if the position directly infront of it is blocked or not
    function isBlocked(x: number, y: number, board: Piece[]): boolean{
        const place = board.find((p) => p.position.x === x && p.position.y === y);

        if (place) {
            return true;
        } else {
            return false;
        }
    }

    //This function check if the diagonal position is blocked by the same colour or not.
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
        <Promt reset={reset} />
        <Board getPossibleMoves={getPossibleMoves} 
            playMove={playMove}
            pieces={pieces}
            //makeAMove={makeAMove}
        />
    </>
    );
}