import "./Tile.css";

interface Props {
    number: number  
}
export default function Tile({number}: Props) {
    if (number % 2 === 0) {
        return <div className="tile white-tile"><img src="./assets/images/pawn_b.png" alt="white-pawn"/></div>
    } else {
        return <div className="tile black-tile"></div>
    }
}