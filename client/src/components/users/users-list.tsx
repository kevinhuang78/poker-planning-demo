import type {CardEvent, User as UserType} from "../../App";
import User from "./user";
import './users.css';

const CARD_VALUES = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

const getCardValuesStats = (allUsers: UsersListProps['allUsers']) => {
  // @ts-expect-error TS does not understand card value is always a number because of the filter
  const allCardValues: number[] = allUsers.filter((user) => typeof user.cardValue === 'number').map((user) => user.cardValue);
  const numberOfUserThatVoted = allCardValues.length;
  const sumOfAll = allCardValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const average = sumOfAll / numberOfUserThatVoted;
  const nearestCard = CARD_VALUES.reduce((prev, curr) => Math.abs(curr - average) < Math.abs(prev - average) ? curr : prev);

  return {
    average,
    nearestCard,
  }
}

export type UsersListProps = {
  selfSelectedCard?: CardEvent['value'];
  selfClientId: string;
  allUsers: UserType[];
  shouldCardsBeFlipped: boolean;
};

const UsersList = ({ selfClientId, allUsers, shouldCardsBeFlipped }: UsersListProps) => {
  const { average, nearestCard } = getCardValuesStats(allUsers);

  return (
    <>
      {shouldCardsBeFlipped && (
        <div className='users-stats'>
          <p>{`The average of the card values is: ${average}`}</p>
          <p>{`The nearest card is: ${nearestCard}`}</p>
        </div>
      )}
      <div className='users'>
        {allUsers.map((user) => (
          <User key={user.clientId} selfClientId={selfClientId} user={user} shouldCardsBeFlipped={shouldCardsBeFlipped} />
        ))}
      </div>
    </>
  );
};

export default UsersList;
