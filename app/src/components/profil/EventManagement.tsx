import React from "react";
import { IEvent, IEventClearable } from "../../redux/types";
import _ from "lodash";

interface EventManagementProps {
  events: IEvent[];
  eventsChanged: IEvent[];
  eventsClear: IEventClearable[];
  closeEvent: (e: React.ChangeEvent<HTMLInputElement>, event: IEvent) => void;
  clearEvent: (
    e: React.ChangeEvent<HTMLInputElement>,
    event: IEventClearable
  ) => void;
  successFullClear: boolean;
}
const isIEventClearable = (
  event: IEvent | IEventClearable
): event is IEventClearable => {
  return (event as IEventClearable).clear !== undefined;
};

const EventManagement: React.FC<EventManagementProps> = ({
  events,
  eventsChanged,
  eventsClear,
  closeEvent,
  clearEvent,
  successFullClear,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    event: IEvent | IEventClearable
  ) => {
    if (isIEventClearable(event)) {
      clearEvent(e, event);
    } else {
      closeEvent(e, event);
    }
  };

  const renderChild = (event: IEvent | IEventClearable) => {
    const { _id, open, name } = event || {};
    const isClear = isIEventClearable(event);
    const checked: boolean = isClear ? (event as IEventClearable).clear : !open;
    const keyString: string = isClear ? "eventClear" : "eventClose";
    const oldEvent = _.find(events, { _id: _id });
    const { open: oldOpen } = oldEvent || {};
    return (
      <div className="relative flex gap-x-3" key={`${keyString}${_id}`}>
        <div className="flex h-6 items-center">
          <input
            id={`${keyString}${_id}`}
            name={`${keyString}${_id}`}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={checked}
            onChange={(e) => handleChange(e, event)}
          />
        </div>
        <div className="text-sm leading-6">
          <label
            htmlFor={`${keyString}${_id}`}
            className="font-medium text-gray-400"
          >
            {name}
          </label>
          <p className="text-gray-500">
            {oldOpen ? "This event is open" : "This event is closed"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="border-b border-gray-400/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-white">Event</h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Admin granted section allow you to manage events.
      </p>
      <div className="mt-10 space-y-10">
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-white/80">
            Close event
          </legend>
          <div className="mt-6 space-y-6">
            {eventsChanged.map((event) => renderChild(event))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-white/80">
            Clear event
          </legend>
          <div className="mt-6 space-y-6">
            {eventsClear.map((event: IEventClearable) => renderChild(event))}
          </div>
          {successFullClear && (
            <div className="mt-4 text-green-500 text-sm">
              Events have been cleared
            </div>
          )}
        </fieldset>
      </div>
    </div>
  );
};

export default EventManagement;
