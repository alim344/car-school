import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../style/WeeklyCalendar.css";

export default function WeeklyCalendar({
    events = [],
    preferenceEvents = [],
    onEventClick = () => {},
    onTimeSelect = () => {},
    initialDate,
    disableNavigation = false,
     selectable = true
}) {
    const allEvents = [
        ...preferenceEvents,
        ...events
    ];

    return (
        <FullCalendar
            plugins={[
                timeGridPlugin,
                interactionPlugin
            ]}

            firstDay={1}
            initialView="timeGridWeek"
            initialDate={initialDate}
            headerToolbar={
                disableNavigation
                    ? {
                        left: "",
                        center: "title",
                        right: ""
                    }
                    : undefined
            }

            events={allEvents}

            selectable={selectable}
            selectMirror={true}

            select={onTimeSelect}

            eventClick={onEventClick}

            allDaySlot={false}

            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"

            height="100%"

            slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }}

            eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }}

            eventContent={(eventInfo) => {

                if (eventInfo.event.display === "background") {
                    return null;
                }

                return (
                    <div className="calendar-event">

                        <div className="calendar-event-time">
                            {eventInfo.timeText}
                        </div>

                        <div className="calendar-event-name">
                            {eventInfo.event.title}
                        </div>

                        <div className="calendar-event-status">
                            {eventInfo.event.extendedProps.status}
                        </div>

                    </div>
                );
            }}
        />
    );
}