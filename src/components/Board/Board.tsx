import React from "react";
import Tile from "../Tile/Tile";

import './Board.css';

const horizontal = ["a", "b", "c", "d", "e", "f"];
const vertical = ["1", "2", "3", "4", "5", "6"];

export default function Board() {
    let board = [];

    for (let j = vertical.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontal.length; i++) {
            const number = j + i + 2;
            board.push(<Tile number={number}/>)
            
        }
    }
    
    return <div id="board">{board}</div>
}