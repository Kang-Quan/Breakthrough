import "./Tile.css";

interface Props {
    image?: string;
    number: number; 
    color?: string;
}
export default function Tile({number, image, color}: Props) {
    if (number % 2 === 0) {
        return (
            <div className="tile white-tile">
                {image && <div style={{backgroundImage: `url(${image})`}} className="piece"></div>}
            </div>
        );
    } else {
        return (
            <div className="tile black-tile">
                {image && <div style={{backgroundImage: `url(${image})`}} className="piece"></div>}
            </div>
        );
    }
}