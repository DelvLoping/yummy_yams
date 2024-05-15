import React, { useEffect, useState } from "react";
import useAxios from "../../hook/axios";
import { IPastry, IRoll, IUser } from "../../redux/types";
import Spinner from "../ui/Spinner";
import _ from "lodash";

interface WinBoardProps {
  eventId: string;
}

const WinBoard: React.FC<WinBoardProps> = ({ eventId }) => {
  const { customAxios } = useAxios();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    customAxios({
      method: "get",
      url: `/game/${eventId}/checkGame`,
    })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPastry = (pastry: IPastry) => {
    const { name } = pastry;
    return <span>{name}</span>;
  };
  const renderRoll = (roll: IRoll) => {
    const { pastryWon, createdAt } = roll;
    return (
      <>
        <span className="font-bold">
          {_.map(pastryWon, (pastry: IPastry) => renderPastry(pastry))}
        </span>{" "}
        -{" "}
        <span className="italic opacity-80">
          {new Date(createdAt).toLocaleDateString("fr")}
        </span>
      </>
    );
  };
  const renderUser = (user: IUser) => {
    const { username, rolls } = user;
    return (
      <li key={username} className="flex flex-row justify-start items-center">
        <p className="font-semibold">
          <span className="text-primary">{username}</span> -{" "}
          {_.map(rolls, (roll: IRoll) => renderRoll(roll))}
        </p>
      </li>
    );
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className=" px-10 flex flex-col items-start justify-center">
          {error ? (
            <p>{error}</p>
          ) : (
            <ul>{_.map(users, (user: IUser) => renderUser(user))}</ul>
          )}
        </div>
      )}
    </>
  );
};
export default WinBoard;
