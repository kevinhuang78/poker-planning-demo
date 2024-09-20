import type {User as UserType} from "../../App";
import type {UsersListProps} from "./users-list";
import Card from "../card/card";

type GetCardValueParams = Pick<UserProps, 'user' | 'shouldCardsBeFlipped' | 'selfSelectedCard'> & { isSelf: boolean; };

const getCardValue = ({ user, shouldCardsBeFlipped, isSelf, selfSelectedCard }: GetCardValueParams) => {
  if (isSelf) return selfSelectedCard;
  if (shouldCardsBeFlipped) return user.cardValue || undefined;

  return user.cardValue ? '...' : undefined;
}

type UserProps = Pick<UsersListProps, 'selfSelectedCard' | 'selfClientId' | 'shouldCardsBeFlipped'> & {
  user: UserType;
}

const User = ({ selfSelectedCard, selfClientId, user, shouldCardsBeFlipped }: UserProps) => {
  const { clientId, username, defaultUsername } = user;
  const isSelf = clientId === selfClientId;
  const cardValue = getCardValue({ user, shouldCardsBeFlipped, isSelf, selfSelectedCard });
  const usernameToShow = username || defaultUsername;

  return (
    <div className='user'>
      <p className={`user-username ${isSelf ? 'user-username--isSelf' : ''}`}>
        {isSelf ? `You: ${usernameToShow}` : usernameToShow}
      </p>
      {cardValue ? (
        <div className='user-card'>
          <Card value={cardValue} onClick={() => {}} />
        </div>
      ) : <p className='user-no-card-selected'>No card selected yet</p>}
    </div>
  )
};

export default User;
