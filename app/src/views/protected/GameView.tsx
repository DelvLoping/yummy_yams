//views/protected/GameView.tsx;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, IRootState } from "../../redux/store";
import useAxios from "../../hook/axios";
import { IAuth, IGame, IPastry, IRoll } from "../../redux/types";
import { addRoll } from "../../redux/slices/auth";
import { getEvent } from "../../redux/slices/game";
import RollGame from "../../components/game/RollGame";
import PastryWon from "../../components/game/PastryWon";
import HistoryRoll from "../../components/game/HistoryRoll";
import _ from "lodash";
import "./GameView.css";
import WinBoard from "../../components/game/WinBoard";

const GameView: React.FC = () => {
  const currentEventName =
    new URLSearchParams(window.location.search).get("eventName") ||
    "Yummy-Yams";
  const dispatch: AppDispatch = useDispatch();
  const { customAxios } = useAxios();
  const [rolls, setRolls] = useState<IRoll[]>([]);
  const [pastryWon, setPastryWon] = useState<IPastry[]>([]);
  const [message, setMessage] = useState<string>("");
  const [dices, setDices] = useState<number[]>([0, 0, 0, 0, 0]);
  const [loadingRoll, setLoadingRoll] = useState<boolean>(false);
  const eventReducer = useSelector((state: IRootState) => state.game as IGame);
  const { event, loading } = eventReducer;
  const userReducer = useSelector((state: IRootState) => state.auth as IAuth);
  const { user } = userReducer;
  const {
    _id: eventId,
    open: eventOpen,
    name: eventName,
    createdAt: eventCreatedAt,
    closedAt: eventClosedAt,
  } = event;
  const isUserWon = pastryWon.length > 0;
  const isUserAlreadyRolled = rolls.length >= 3;

  useEffect(() => {
    dispatch(getEvent(currentEventName));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (event._id && !_.isEmpty(user) && !loading) {
      const newRolles: IRoll[] =
        _.filter(user.rolls, (roll: IRoll) => roll.event._id === event._id) ||
        [];

      const newPastries: IPastry[] = _.flatMap(
        newRolles,
        (roll) => roll.pastryWon
      );
      const diceValues = _.find(newRolles, (roll) => roll.pastryWon.length > 0)
        ?.diceValues ||
        newRolles[newRolles.length - 1]?.diceValues || [0, 0, 0, 0, 0];
      setRolls(newRolles);
      setPastryWon(newPastries);
      if (!_.isEqual(dices, diceValues)) {
        setDices(diceValues);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, user, loading]);

  const launch = () => {
    if (isUserWon || isUserAlreadyRolled || loadingRoll || !eventOpen) return;
    setMessage("");
    setLoadingRoll(true);
    customAxios({
      method: "get",
      url: `/game/${eventId}/launchRoll`,
    })
      .then((response) => {
        if (response.status === 200) {
          setDices(response.data.diceValues);
          setTimeout(() => {
            dispatch(addRoll(response.data));
            setMessage(response.data.winCombination);
          }, 3000);
        }
      })
      .finally(() => {
        setLoadingRoll(false);
      });
  };

  return (
    <div className=" pt-8 px-10 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">
        Event : <span className="text-primary">{eventName}</span>
      </h1>
      <p className={"text-lg  mb-4"}>
        <span
          className={` ${
            eventOpen ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {eventOpen ? "Open" : "Closed"}
        </span>
        {eventOpen
          ? ` - Created at ${new Date(eventCreatedAt).toLocaleDateString("fr")}`
          : ` - Closed at ${new Date(
              eventClosedAt as string
            ).toLocaleDateString("fr")}`}
      </p>

      {eventOpen ? (
        <>
          <div className="flex flex-row w-full items-center justify-bewteen h-[25rem] p-8 gap-4">
            <div className="flex flex-col w-2/3 items-center justify-start bg-blue-500/10 h-full rounded-lg px-8 pb-8 pt-20">
              <RollGame
                dices={dices}
                isUserAlreadyRolled={isUserAlreadyRolled}
                isWon={isUserWon}
                launch={launch}
                message={message}
                disabled={!eventOpen || isUserWon || isUserAlreadyRolled}
              />
            </div>

            <div className="flex flex-col bg-blue-500/10 h-full overflow-y-auto rounded-lg px-8 pb-8 pt-4 w-1/3">
              <PastryWon pastryWon={pastryWon} />
            </div>
          </div>
          {rolls.length > 0 && (
            <div className="flex flex-col w-full items-center justify-center pb-8 px-8">
              <HistoryRoll rolls={rolls} />
            </div>
          )}
        </>
      ) : (
        <>
          {eventId && (
            <div className="flex flex-col w-fit items-center justify-start bg-blue-500/10 h-full rounded-lg p-4 mt-10">
              <WinBoard eventId={eventId} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameView;
