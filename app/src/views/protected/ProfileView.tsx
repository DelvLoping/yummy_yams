//views/protected/ProfileView.tsx;
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { AppDispatch, IRootState } from "../../redux/store";
import { IAuth, IEvent } from "../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import useAxios from "../../hook/axios";
import Spinner from "../../components/ui/Spinner";
import { updateUser } from "../../redux/slices/auth";
import Input from "../../components/ui/Input";

interface IEventClearable extends IEvent {
  clear: boolean;
}

const ProfileView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { customAxios } = useAxios();
  const userReducer = useSelector((state: IRootState) => state.auth as IAuth);
  const { user } = userReducer;
  const [formData, setFormData] = useState<{
    username: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    username: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [userError, setUserError] = useState<string>("");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventsChanged, setEventsChanged] = useState<IEvent[]>([]);
  const [eventErrorChanged, setEventErrorChanged] = useState<
    { id: string; message: string }[]
  >([]);
  const [eventsClear, setEventsClear] = useState<IEventClearable[]>([]);
  const [eventErrorClear, setEventErrorClear] = useState<
    { id: string; message: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successFullClear, setSuccessFullClear] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setUserError("Passwords do not match");
    } else {
      setUserError("");
    }
  }, [formData.newPassword, formData.confirmNewPassword]);

  const cancel = () => {
    setFormData({
      username: user.username,
      newPassword: "",
      confirmNewPassword: "",
    });
    setEventsChanged([...events]);
    const eventsWithClear: IEventClearable[] = events.map((event) => ({
      ...event,
      clear: false,
    }));
    setEventsClear([...eventsWithClear]);
  };

  useEffect(() => {
    setLoading(true);
    customAxios({
      url: "/event",
      method: "GET",
    })
      .then((response) => {
        setEvents(response.data);
        setEventsChanged([...response.data]);
        const eventsWithClear: IEventClearable[] = response.data.map(
          (event: IEvent) => ({
            ...event,
            clear: false,
          })
        );
        setEventsClear([...eventsWithClear]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!_.isEmpty(user)) {
      setFormData({
        username: user.username,
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user]);

  const isChanged =
    (user.username !== formData.username ||
      (formData.newPassword !== "" &&
        formData.confirmNewPassword !== "" &&
        _.isEqual(formData.newPassword, formData.confirmNewPassword)) ||
      !_.isEqual(events, eventsChanged) ||
      _.some(eventsClear, ["clear", true])) &&
    userError === "";

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isChanged) {
      return;
    }

    const isUserChanged =
      user.username !== formData.username ||
      (formData.newPassword !== "" &&
        formData.confirmNewPassword !== "" &&
        _.isEqual(formData.newPassword, formData.confirmNewPassword));
    setLoading(true);
    setEventErrorChanged([]);
    setEventErrorClear([]);
    setSuccessFullClear(false);
    const userRequest = isUserChanged
      ? customAxios({
          url: "/user/" + user._id,
          method: "PUT",
          data: {
            username: formData.username,
            password: formData.newPassword,
          },
        })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              console.log(response.data);
              dispatch(updateUser(response.data));
            }
          })
          .catch((error) => {
            setUserError(error);
          })
      : Promise.resolve();

    const eventsChangedFiltered = eventsChanged.filter((event: IEvent) => {
      const oldEvent = _.find(events, { _id: event._id });
      return !_.isEqual(event, oldEvent);
    });
    const eventsChangedRequest = eventsChangedFiltered.map((event: IEvent) => {
      customAxios({
        url: "/event/" + event._id,
        method: "PUT",
        data: {
          open: event.open,
        },
      })
        .then((response) => {
          const newEvent: IEvent = response.data;
          const eventIndex: number = _.findIndex(events, {
            _id: newEvent._id,
          });
          if (eventIndex !== -1) {
            const updatedEvents: IEvent[] = _.cloneDeep(events);
            _.set(updatedEvents, `[${eventIndex}]`, newEvent);
            setEvents(updatedEvents);
          } else {
            setEvents([...events, newEvent]);
          }
        })
        .catch((error) => {
          setEventErrorChanged([
            ...eventErrorChanged,
            { id: event._id, message: error },
          ]);
        });
    });

    const eventsClearFiltered: IEventClearable[] = eventsClear.filter(
      (event: IEventClearable) => {
        return event.clear;
      }
    );
    const eventsClearRequest = eventsClearFiltered.map(
      (event: IEventClearable) => {
        customAxios({
          url: "/game/" + event._id + "/clearEvent",
          method: "GET",
        }).catch((error) => {
          setEventErrorClear([
            ...eventErrorClear,
            { id: event._id, message: error },
          ]);
        });
      }
    );

    Promise.all([
      ...eventsChangedRequest,
      ...eventsClearRequest,
      userRequest,
    ]).then(() => {
      setLoading(false);
      if (eventsClearFiltered.length > 0) {
        setEventsClear(
          _.map(eventsClear, (event) => ({
            ...event,
            clear: false,
          }))
        );
        setSuccessFullClear(true);
        const newUser = _.cloneDeep(user);
        _.forEach(eventsClearFiltered, (event) => {
          newUser.rolls = _.filter(
            newUser.rolls,
            (roll) => roll.event._id !== event._id
          );
        });
        dispatch(updateUser(newUser));
      }
    });
  };

  const closeEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    event: IEvent
  ) => {
    const checked: boolean = e.target.checked;
    const newEvent: IEvent = { ...event };
    newEvent.open = !checked;
    const updatedEvents: IEvent[] = _.cloneDeep(eventsChanged);
    const eventIndex: number = _.findIndex(updatedEvents, {
      _id: newEvent._id,
    });

    if (eventIndex !== -1) {
      _.set(updatedEvents, `[${eventIndex}]`, newEvent);
      setEventsChanged(updatedEvents);
    }
  };

  const clearEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    event: IEventClearable
  ) => {
    const checked: boolean = e.target.checked;
    const newEvent: IEventClearable = { ...event };
    newEvent.clear = checked;
    const updatedEvents: IEventClearable[] = _.cloneDeep(eventsClear);
    const eventIndex: number = _.findIndex(updatedEvents, {
      _id: newEvent._id,
    });

    if (eventIndex !== -1) {
      _.set(updatedEvents, `[${eventIndex}]`, newEvent);
      setEventsClear(updatedEvents);
    }
  };

  return (
    <>
      <div className=" px-10 flex flex-col items-center justify-center pb-10">
        <h1 className="text-3xl font-bold mb-28">Profile</h1>
        <form>
          <div className="space-y-12">
            <div className="border-b border-gray-400/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">
                General Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                You can update your general information here.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <Input
                  id="username"
                  name="username"
                  label="Username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="sm:col-span-4"
                />
              </div>
            </div>

            <div className="border-b border-gray-400/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">
                Confidential Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Be careful if you change your password, we cannot recover it.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <Input
                  id="newPassword"
                  name="newPassword"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="sm:col-span-4"
                />
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  label="Confirm new password"
                  type="password"
                  autoComplete="confirm-new-password"
                  required
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="sm:col-span-4"
                />
              </div>
              {userError && (
                <div className="mt-4 text-red-500 text-sm">{userError}</div>
              )}
            </div>

            <div className="border-b border-gray-400/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">
                Event
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Admin granted section allow you to manage events.
              </p>

              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-white/80">
                    Close event
                  </legend>
                  <div className="mt-6 space-y-6">
                    {eventsChanged.map((event) => {
                      const { _id, name, open } = event;
                      const oldEvent = _.find(events, { _id: _id });
                      const { open: oldOpen } = oldEvent || {};
                      return (
                        <div
                          className="relative flex gap-x-3"
                          key={"eventClose" + _id}
                        >
                          <div className="flex h-6 items-center">
                            <input
                              id={"eventClose" + _id}
                              name={"eventClose" + _id}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              checked={!open}
                              onChange={(e) => closeEvent(e, event)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor={"eventClose" + _id}
                              className="font-medium text-gray-400"
                            >
                              {name}
                            </label>
                            <p className="text-gray-500">
                              {oldOpen
                                ? " This event is open"
                                : " This event is closed"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-white/80">
                    Clear event
                  </legend>
                  <div className="mt-6 space-y-6">
                    {eventsClear.map((event) => {
                      const { _id, name, clear } = event;
                      const oldEvent = _.find(events, { _id: _id });
                      const { open: oldOpen } = oldEvent || {};
                      return (
                        <div
                          className="relative flex gap-x-3"
                          key={"eventClear" + _id}
                        >
                          <div className="flex h-6 items-center">
                            <input
                              id={"eventClear" + _id}
                              name={"eventClear" + _id}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              checked={clear}
                              onChange={(e) => clearEvent(e, event)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor={"eventClear" + _id}
                              className="font-medium text-gray-400"
                            >
                              {name}
                            </label>
                            <p className="text-gray-500">
                              {oldOpen
                                ? " This event is open"
                                : " This event is closed"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {successFullClear && (
                    <div className="mt-4 text-green-500 text-sm">
                      Events have been cleared
                    </div>
                  )}
                </fieldset>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Spinner />
            </div>
          ) : (
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-400 disabled:opacity-50"
                onClick={cancel}
                disabled={!isChanged}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-600"
                onClick={(e) => handleSubmit(e)}
                disabled={!isChanged}
              >
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
export default ProfileView;
