import type {User as UserType} from "../../App";
import type {UsersListProps} from "./users-list";
import Card from "../card/card";

type UserProps = Pick<UsersListProps, 'selfSelectedCard' | 'lastCardEvent' | 'selfClientId'> & {
  user: UserType;
}

const User = ({ selfSelectedCard, selfClientId, user, lastCardEvent }: UserProps) => {
  const { clientId, username, defaultUsername } = user;
  const isSelf = clientId === selfClientId;
  const cardEventValue = lastCardEvent && lastCardEvent.clientId === user.clientId ? lastCardEvent.value : undefined;
  // TODO: true should be replaced with boolean to check if cards are flipped or hidden
  const cardValue = isSelf && true ? selfSelectedCard : cardEventValue;
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
