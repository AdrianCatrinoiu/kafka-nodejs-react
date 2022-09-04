import { useSelector } from "react-redux";
import UserDetails from "../../components/UserDetails";
import { selectCurrentUser } from "../auth/authSlice";
import { useGetUserQuery } from "./userApiSlice";

const UserData = () => {
  const userInfo = useSelector(selectCurrentUser);

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserQuery(userInfo.id);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = (
      <section className="users">
        <h1>Users List</h1>

        <UserDetails
          userData={{ id: user.id, name: user.name, email: user.email }}
        />
      </section>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};

export default UserData;
