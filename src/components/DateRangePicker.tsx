// DateRangePicker.tsx
import React, { useState } from "react";
import "./DateRangePicker.css";

interface PredefinedRange {
  label: string;
  getValue: () => {
    startDate: Date;
    endDate: Date;
  };
}

interface DateRangePickerProps {
  onChange?: (dateRange: [string, string], weekends: string[]) => void;
  predefinedRanges?: PredefinedRange[];
}

type DateOrNull = Date | null;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  predefinedRanges = [],
}) => {
  const [startDate, setStartDate] = useState<DateOrNull>(null);
  const [endDate, setEndDate] = useState<DateOrNull>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  // Helper functions for date manipulation
  const isWeekend = (date: DateOrNull): boolean => {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const addDays = (date: DateOrNull, days: number): DateOrNull => {
    if (!date) return null;
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDate = (date: DateOrNull): string => {
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getWeekendDatesInRange = (
    start: DateOrNull,
    end: DateOrNull
  ): Date[] => {
    if (!start || !end) return [];
    const weekends: Date[] = [];
    let current = new Date(start);

    while (current <= end) {
      if (isWeekend(current)) {
        weekends.push(new Date(current));
      }
      const nextDay = addDays(current, 1);
      if (!nextDay) break;
      current = nextDay;
    }

    return weekends;
  };

  const getFirstWeekday = (date: Date): Date => {
    const result = new Date(date);
    while (isWeekend(result)) {
      result.setDate(result.getDate() - 1);
    }
    return result;
  };

  const getLastWeekday = (date: Date): Date => {
    const result = new Date(date);
    while (isWeekend(result)) {
      result.setDate(result.getDate() + 1);
    }
    return result;
  };

  const handlePredefinedRange = (range: PredefinedRange): void => {
    const { startDate: newStartDate, endDate: newEndDate } = range.getValue();

    // Adjust dates to nearest weekdays if they fall on weekends
    const adjustedStartDate = getFirstWeekday(newStartDate);
    const adjustedEndDate = getLastWeekday(newEndDate);

    setStartDate(adjustedStartDate);
    setEndDate(adjustedEndDate);

    onChange?.(
      [formatDate(adjustedStartDate), formatDate(adjustedEndDate)],
      getWeekendDatesInRange(adjustedStartDate, adjustedEndDate).map(formatDate)
    );
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date: DateOrNull): boolean => {
    if (!date || !startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isSameDate = (date1: DateOrNull, date2: DateOrNull): boolean => {
    if (!date1 || !date2) return false;
    return formatDate(date1) === formatDate(date2);
  };

  const getDateClassName = (date: Date | null): string => {
    if (!date) return "calendar-day empty";

    const classNames = ["calendar-day"];

    if (isWeekend(date)) {
      classNames.push("weekend");
    }

    if (isDateInRange(date) && !isWeekend(date)) {
      classNames.push("in-range");
    }

    if (isSameDate(date, startDate)) {
      classNames.push("selected start-date");
    }

    if (isSameDate(date, endDate)) {
      classNames.push("selected end-date");
    }

    return classNames.join(" ");
  };

  const handleDateClick = (date: Date): void => {
    if (isWeekend(date)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(startDate);
      } else {
        setEndDate(date);
      }
    }

    if (startDate && date > startDate) {
      const weekends = getWeekendDatesInRange(startDate, date);
      onChange?.(
        [formatDate(startDate), formatDate(date)],
        weekends.map(formatDate)
      );
    }
  };

  const handleMonthChange = (increment: number): void => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderCalendar = (): JSX.Element => {
    const days = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = Array(7).fill(null);
    let dayCounter = 1;

    // Fill in the first week
    for (let i = firstDay; i < 7 && dayCounter <= days; i++) {
      week[i] = new Date(currentYear, currentMonth, dayCounter++);
    }
    weeks.push(week);

    // Fill in remaining weeks
    while (dayCounter <= days) {
      week = Array(7).fill(null);
      for (let i = 0; i < 7 && dayCounter <= days; i++) {
        week[i] = new Date(currentYear, currentMonth, dayCounter++);
      }
      weeks.push(week);
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => handleMonthChange(-1)}>
            ←
          </button>
          <div className="current-month">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button className="nav-button" onClick={() => handleMonthChange(1)}>
            →
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {weeks.map((week, weekIndex) =>
            week.map((date, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={getDateClassName(date)}
                onClick={() => date && handleDateClick(date)}
              >
                {date ? date.getDate() : ""}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-picker">
      <div className="calendar-container">{renderCalendar()}</div>
      {predefinedRanges.length > 0 && (
        <div className="predefined-ranges-container">
          <h3 className="predefined-ranges-title">Predefined Ranges</h3>
          <div className="predefined-ranges-list">
            {predefinedRanges.map((range, index) => (
              <button
                key={index}
                className="predefined-range-button"
                onClick={() => handlePredefinedRange(range)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
