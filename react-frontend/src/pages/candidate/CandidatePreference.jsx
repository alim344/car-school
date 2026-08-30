import { useState } from "react";

import WeeklyCalendar from "../../components/WeeklyCalendar";

import "../../style/CandidatePreference.css";

export default function CandidatePreference() {

    const [preferences, setPreferences] = useState([]);

    const handleTimeSelect = (info) => {

        const newPreference = {
            id: `preference-${Date.now()}`,
            start: info.start,
            end: info.end,
            display: "background",
            classNames: ["candidate-preference"],
            extendedProps: {
                preference: true
            }
        };

        setPreferences( [
            
            newPreference
        ]);
    };


   const getNextWeekRange = () => {

        const today = new Date();
        const day = today.getDay();

        const daysUntilNextMonday =
            day === 0
                ? 1
                : 8 - day;

        const nextMonday = new Date(today);

        nextMonday.setDate(
            today.getDate() + daysUntilNextMonday
        );

        nextMonday.setHours(0, 0, 0, 0);


        const nextSunday = new Date(nextMonday);

        nextSunday.setDate(
            nextMonday.getDate() + 7
        );

        return {
            start: nextMonday,
            end: nextSunday
        };
    };

    const nextWeekRange = getNextWeekRange();

    const handleSaveNextWeekPreference = () => {

        console.log("Preferences to save:", preferences);

    };




    return (

        <div className="candidate-preference-container">

            <div className="candidate-preference-calendar">

                <WeeklyCalendar
                    events={[]}
                    preferenceEvents={preferences}
                    onTimeSelect={handleTimeSelect}
                    onEventClick={() => {}}
                    initialDate={nextWeekRange.start}

                    validRange={{
                        start: nextWeekRange.start,
                        end: nextWeekRange.end
                    }}
                    disableNavigation={true}
                />

            </div>


            <div className="candidate-preference-sidebar">

                <h2>Preference</h2>

                <button
                    className="save-preference-button"
                    onClick={handleSaveNextWeekPreference}
                >
                    Save Next Week Preference
                </button>

            </div>

        </div>

    );
}