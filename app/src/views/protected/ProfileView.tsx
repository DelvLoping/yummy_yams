//views/protected/ProfileView.tsx;
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { AppDispatch, IRootState } from "../../redux/store";
import { IAuth, IEvent, IEventClearable } from "../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import useAxios from "../../hook/axios";
import Spinner from "../../components/ui/Spinner";
import { updateUser } from "../../redux/slices/auth";
import { ROLE_ADMIN } from "../../constants/api";
import ConfidentialInformationForm from "../../components/profil/ConfidentialInformationForm";
import GeneralInformationForm from "../../components/profil/GeneralInformationForm";
import EventManagement from "../../components/profil/EventManagement";

const ProfileView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { customAxios } = useAxios();
  const userReducer = useSelector((state: IRootState) => state.auth as IAuth);
  const { user } = userReducer;
  const { role } = user;
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

  const isAdmin = role === ROLE_ADMIN;
  useEffect(() => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setUserError("Passwords do not match");
    } else {
      setUserError("");
    }
  }, [formData.newPassword, formData.confirmNewPassword]);

  const updateEventsLists = (events: IEvent[]) => {
    setEventsChanged([...events]);
    const eventsWithClear: IEventClearable[] = events.map((event) => ({
      ...event,
      clear: false,
    }));
    setEventsClear([...eventsWithClear]);
  };
  const cancel = () => {
    setFormData({
      username: user.username,
      newPassword: "",
      confirmNewPassword: "",
    });
    updateEventsLists(events);
  };

  useEffect(() => {
    setLoading(true);
    customAxios({
      url: "/event",
      method: "GET",
    })
      .then((response) => {
        setEvents(response.data);
        updateEventsLists(response.data);
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
            if (response.status === 200) {
              dispatch(updateUser(response.data));
            }
          })
          .catch((error) => {
            setUserError(error);
          })
      : Promise.resolve();

    const eventsChangedFiltered = eventsChanged.filter((event: IEvent) => {
      const oldEvent = _.find(events, { _id: event._id });
      return !_.isEqual(event, oldEvent) && isAdmin;
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
            updateEventsLists(updatedEvents);
          } else {
            setEvents([...events, newEvent]);
            updateEventsLists([...events, newEvent]);
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
        return event.clear && isAdmin;
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
          _.map(events, (event) => ({
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
      <div className=" px-10 flex flex-col items-center justify-center pb-10 pt-8">
        <h1 className="text-3xl font-bold mb-28">Profile</h1>
        <form>
          <div className="space-y-12">
            <GeneralInformationForm
              formData={formData}
              handleChange={handleChange}
            />
            <ConfidentialInformationForm
              formData={formData}
              handleChange={handleChange}
              userError={userError}
            />
            {isAdmin && (
              <EventManagement
                events={events}
                eventsChanged={eventsChanged}
                eventsClear={eventsClear}
                closeEvent={closeEvent}
                clearEvent={clearEvent}
                successFullClear={successFullClear}
              />
            )}
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
