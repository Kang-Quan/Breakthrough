import React, { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import { Piece, HORIZONTAL , VERTICAL , Position, BOARD_SIZE, GRID_SIZE, samePosition } from "../../Constants";

import './Board.css';


interface Props {
    getPossibleMoves: () => void;
    playMove: (piece: Piece, position: Position) => Promise<boolean>;
    pieces: Piece[];
}

export default function Board( {getPossibleMoves, playMove, pieces } : Props ) {
    const boardRef = useRef<HTMLDivElement>(null);
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    
    const [grabPosition, setGrabPosition] = useState<Position>({x: 0, y: 0});

    
    let board = [];
    //set up the board
    for (let j = VERTICAL.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL.length; i++) {
            const number = j + i + 2;
            let color = undefined;
            let image = undefined;
            const compare = {x: i, y: j}
            pieces.forEach((p) => {
                if (samePosition(p.position, compare)) {
                    image = p.image;
                    color = p.color;
                }
            });

            let currentPiece = activePiece != null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => samePosition(p, compare)) : false;
            board.push(<Tile key={`${j},${i}`} image={image} number={number} color={color} highlight={highlight} />)
        }
    }


    function grabPiece(e: React.MouseEvent) {
        e.preventDefault();
        const element = e.target as HTMLElement;
        const board = boardRef.current;
        getPossibleMoves();
        
        if (element.classList.contains("piece") && board) {
            const gridX = Math.floor((e.clientX - board.offsetLeft - BOARD_SIZE) / GRID_SIZE) + HORIZONTAL.length;
            const gridY = Math.abs(Math.ceil((e.clientY - board.offsetTop - BOARD_SIZE) / GRID_SIZE));
            console.log(gridX, gridY, "grid");
            setGrabPosition({x: gridX, y: gridY})
            const x = e.clientX - (GRID_SIZE / 2);
            const y = e.clientY - (GRID_SIZE / 2);
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            setActivePiece(element);


            document.addEventListener(
                "mouseup", 
                (event) => {
                    event.preventDefault();
                    dropPiece(e);
                },
                { once: true}
            );
        } 
    }

    function movePiece(e: React.MouseEvent) {
        const board = boardRef.current;
        e.preventDefault();

        if (activePiece && board) {
            const x = e.clientX - (GRID_SIZE / 2);
            const y = e.clientY - (GRID_SIZE / 2);
            activePiece.style.position = "absolute";
            activePiece.style.left =`${x}px`;
            activePiece.style.top = `${y}px`
        }
    }

    async function dropPiece(e: React.MouseEvent) {
        e.preventDefault();
        const board = boardRef.current;
        if (activePiece && board) {
            const x = Math.floor((e.clientX - board.offsetLeft - BOARD_SIZE) / GRID_SIZE) + HORIZONTAL.length;
            const y = Math.abs(Math.ceil((e.clientY - board.offsetTop - BOARD_SIZE) / GRID_SIZE));
            
            const newPosition = {x: x, y: y};

            const currentPiece = pieces.find(p => samePosition(p.position, grabPosition));

            if (currentPiece) {
                var success = await playMove(currentPiece, newPosition);
                
                if (!success) {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                } 
            }
            setActivePiece(null);
        } 
    }
    return (
        <div 
            onMouseMove={e => movePiece(e)} 
            onMouseDown={e => grabPiece(e)} 
            onMouseUp={e => dropPiece(e)} 
            id="board"
            ref={boardRef}
        >
            {board}
        </div>
    );
}