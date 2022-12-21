import "./Tile.css";

interface Props {
    image?: string;
    number: number; 
    color?: string;
    highlight: boolean;
}
export default function Tile({number, image, color, highlight}: Props) {
    const className: string = ["tile",
        number % 2 === 0 && "black-tile",
        number % 2 !== 0 && "white-tile",
        highlight && "tile-highlight"].filter(Boolean).join(' ');

    return (
        <div className={className}>
            {image && <div style={{backgroundImage: `url(${image})`}} className="piece"></div>}
        </div>
    );
}