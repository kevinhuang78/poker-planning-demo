import type {CardValue, User as UserType} from "../../App";
import type {UsersListProps} from "./users-list";
import Card from "../card/card";

const shouldShowCardValue = (cardValue?: CardValue) => typeof cardValue === 'number' || !!cardValue;

type GetCardValueParams = Pick<UserProps, 'user' | 'shouldCardsBeFlipped'> & { isSelf: boolean; };

const getCardValue = ({ user, shouldCardsBeFlipped, isSelf }: GetCardValueParams) => {
  const isCardValueFilled = shouldShowCardValue(user.cardValue);
  if (isSelf) return user.cardValue;
  if (shouldCardsBeFlipped) return isCardValueFilled ? user.cardValue : undefined;

  return isCardValueFilled ? '...' : undefined;
}

type UserProps = Pick<UsersListProps, 'selfClientId' | 'shouldCardsBeFlipped'> & {
  user: UserType;
}

const User = ({ selfClientId, user, shouldCardsBeFlipped }: UserProps) => {
  const { clientId, username, defaultUsername } = user;
  const isSelf = clientId === selfClientId;
  const cardValue = getCardValue({ user, shouldCardsBeFlipped, isSelf });
  const usernameToShow = username || defaultUsername;
  const isCardValueFilled = shouldShowCardValue(user.cardValue);

  return (
    <div className='user'>
      <p className={`user-username ${isSelf ? 'user-username--isSelf' : ''}`}>
        {isSelf ? `You: ${usernameToShow}` : usernameToShow}
      </p>
      {isCardValueFilled ? (
        <div className='user-card'>
          {/* @ts-expect-error TS does not understand cardValue is always a number or a string here */}
          <Card value={cardValue} onClick={() => {}} />
        </div>
      ) : <p className='user-no-card-selected'>No card selected yet</p>}
    </div>
  )
};

export default User;
