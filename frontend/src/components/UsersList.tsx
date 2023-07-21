import { IFormData } from "../types";

interface IUserList {
  isDisplayingErrors: boolean;
  users: IFormData[];
}

const UsersList = ({ users, isDisplayingErrors }: IUserList): React.ReactElement => {
  if (users.length)
    return (
      <ul>
        {users.map(({ email, number }) => {
          return (
            <li key={`${email}-${number}`}>
              {email}: {number}
            </li>
          );
        })}
      </ul>
    );
  if (!isDisplayingErrors) return <span>No users to display</span>;
  return <></>;
};

export default UsersList;
