import type {CardEvent, User as UserType} from "../../App";
import User from "./user";
import './users.css';

export type UsersListProps = {
  selfSelectedCard?: CardEvent['value'];
  selfClientId: string;
  allUsers: UserType[];
  shouldCardsBeFlipped: boolean;
};

const UsersList = ({ selfClientId, allUsers, shouldCardsBeFlipped }: UsersListProps) => (
  <div className='users'>
    {allUsers.map((user) => (
      <User key={user.clientId} selfClientId={selfClientId} user={user} shouldCardsBeFlipped={shouldCardsBeFlipped} />
    ))}
  </div>
);

export default UsersList;
