import type {CardValue} from "../../App";

type CardProps = {
  value: CardValue;
  selectedCard?: CardValue;
  onClick: (value: CardValue) => void;
};

const Card = ({ value, onClick, selectedCard }: CardProps) => {
  const isSelected = selectedCard === value;
  const handleClick = () => {
    onClick(value);
  };

  return (
    <div className={`card ${isSelected ? 'isSelected' : ''}`} onClick={handleClick}>
      {value}
    </div>
  )
};

export default Card;
