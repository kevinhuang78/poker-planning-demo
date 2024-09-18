import type {CardEvent, User as UserType} from "../../App";
import User from "./user";
import './users.css';

export type UsersListProps = {
  selfSelectedCard?: CardEvent['value'];
  selfClientId: string;
  allUsers: UserType[];
  lastCardEvent?: CardEvent;
};

const UsersList = ({ selfSelectedCard, selfClientId, allUsers, lastCardEvent }: UsersListProps) => (
  <div className='users'>
    {allUsers.map((user) => (
      <User key={user.clientId} selfClientId={selfClientId} user={user} selfSelectedCard={selfSelectedCard} lastCardEvent={lastCardEvent} />
    ))}
  </div>
);

export default UsersList;
