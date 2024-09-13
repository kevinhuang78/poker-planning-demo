import type {CardEvent} from "../../App";

type CardProps = {
  value: CardEvent['value'];
  onClick: (value: CardEvent['value']) => void;
};

const Card = ({ value, onClick }: CardProps) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <div className='card' onClick={handleClick}>
      {value}
    </div>
  )
};

export default Card;
