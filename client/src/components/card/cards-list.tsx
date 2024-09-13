import type {CardEvent} from "../../App";
import Card from "./card";
import './cards.css';

const CARDS: CardEvent['value'][] = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', 'pass'];

type CardsListProps = {
  selectedCard?: CardEvent['value'];
  setSelectedCard: (selectedCard: CardEvent['value']) => void;
}

const CardsList = ({ selectedCard, setSelectedCard }: CardsListProps) => {
  const handleClick = (value: CardEvent['value']) => {
    setSelectedCard(value)
  };

  return (
    <div className='cards'>
      {CARDS.map((value) => <Card key={value} value={value} selectedCard={selectedCard} onClick={handleClick} />)}
    </div>
  )
};

export default CardsList;
