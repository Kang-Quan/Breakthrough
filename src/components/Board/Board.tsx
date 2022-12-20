import React, { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import Referee from "../../referee/Referee";

import './Board.css';

const horizontal = ["a", "b", "c", "d", "e", "f"];
const vertical = ["1", "2", "3", "4", "5", "6"];

export interface Piece {
    image: string;
    x: number;
    y: number;
    color: string;
}


export default function Board() {
    const boardRef = useRef<HTMLDivElement>(null);
    const initialBoard: Piece[] = [];

    const referee = new Referee();

    
    //fill the board with pawns
    for (let i = 0; i < horizontal.length; i++) {
        for (let j = 0; j < vertical.length; j++) {
            if ((j >=0 && j <= 1)) {
                initialBoard.push({image: "assets/images/pawn_w.png", x: i, y: j, color: "white-pawn"})
            } else if ((j >= vertical.length - 2 && j <= vertical.length - 1)) {
                initialBoard.push({image: "assets/images/pawn_b.png", x: i, y: j, color: "black-pawn"})
            }
            
        }
    }

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoard);
    const [gridX, setGridX] = useState(0); 
    const [gridY, setGridY] = useState(0);
    
    
    let board = [];
    //set up the board
    for (let j = vertical.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontal.length; i++) {
            const number = j + i + 2;
            let color = undefined;
            let image = undefined;
            pieces.forEach((p) => {
                if (p.x === i && p.y === j) {
                    image = p.image;
                    color = p.color;
                }
            });
            board.push(<Tile key={`${j},${i}`} image={image} number={number} color={color}/>)
        }
    }

    

    function grabPiece(e: React.MouseEvent) {
        e.preventDefault();
        const element = e.target as HTMLElement;
        const board = boardRef.current;
        
        if (element.classList.contains("piece") && board) {
            const gridX = Math.floor((e.clientX - board.offsetLeft - 804) / 134) + horizontal.length;
            const gridY = Math.abs(Math.ceil((e.clientY - board.offsetTop - 804) / 134));
            console.log(gridX, gridY, "grid");
            setGridX(gridX);
            setGridY(gridY);
            const x = e.clientX - 67;
            const y = e.clientY - 67;
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
            //console.log(e.target);

            // const minX = board.offsetLeft; //- 33.5;
            // const minY = board.offsetTop; //- 33.5;
            // const maxX = board.offsetLeft + board.clientWidth;// - 100.5;
            // const maxY = board.offsetTop + board.clientHeight;// - 100.5;

            const x = e.clientX - 67;
            const y = e.clientY - 67;
            activePiece.style.position = "absolute";
            activePiece.style.left =`${x}px`;
            activePiece.style.top = `${y}px`
            // if (x < minX) {
            //     activePiece.style.left = `${minX}px`
            // } else if (x > maxX) {
            //     activePiece.style.left = `${maxX}px`
            // } else {
            //     activePiece.style.left = `${x}px`
            // }

            // if (y < minY) {
            //     activePiece.style.top = `${minY}px`
            // } else if (y > maxY) {
            //     activePiece.style.top = `${maxY}px`
            // } else {
            //     activePiece.style.top = `${y}px`
            // }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        e.preventDefault();
        const board = boardRef.current;
        console.log(board);
        if (activePiece && board) {
            console.log("checking")
            const x = Math.floor((e.clientX - board.offsetLeft - 804) / 134) + horizontal.length;
            const y = Math.abs(Math.floor((e.clientY - board.offsetTop - 804) / 134)) - 1;
            
            
            //updates the position
            setPieces((value) => {
                const pieces = value.map((p) => {
                    //console.log(p);
                    if (p.x === gridX && p.y === gridY) {
                        //console.log(x, y)
                        const isValidMove = referee.isValidMove(gridX, gridY, x, y, p.color, value);

                        if (isValidMove) {
                            p.x = x;
                            p.y = y;
                        } else {
                            activePiece.style.position = 'relative';
                            activePiece.style.removeProperty('top');
                            activePiece.style.removeProperty('left');
                        }
                    }
                    return p;
                });
                return pieces;
            });
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