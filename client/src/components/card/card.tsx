import type {CardEvent} from "../../App";

type CardProps = {
  value: CardEvent['value'];
  selectedCard?: CardEvent['value'];
  onClick: (value: CardEvent['value']) => void;
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
