
import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CustomDatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEAR_START = 1950;
const YEAR_END = new Date().getFullYear() + 10;

function parseDateValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);

  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isSameDate(
  first: Date | null,
  second: Date,
): boolean {
  return Boolean(
    first &&
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate(),
  );
}

function getPreviousMonth(): Date {
  const today = new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1,
  );
}

export function CustomDatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select date',
  label,
  required = false,
  error = false,
  disabled = false,
}: CustomDatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const selectedDate = parseDateValue(value);

  const [isOpen, setIsOpen] = useState(false);

  const [visibleMonth, setVisibleMonth] = useState<Date>(
    () => getPreviousMonth(),
  );

  const [isAnimating, setIsAnimating] = useState(false);

  /*
   * Keep the currently visible month/year synchronized
   * with the selected date when the picker is opened.
   */
  const openPicker = () => {
    if (disabled) return;

    if (selectedDate) {
      setVisibleMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1,
        ),
      );
    } else {
      setVisibleMonth(getPreviousMonth());
    }

    setIsOpen(true);
  };

  /*
   * Close when clicking outside or pressing Escape.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        !containerRef.current?.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [isOpen]);

  /*
   * Month navigation with a small fade/scale animation.
   */
  const changeMonth = (offset: number) => {
    setIsAnimating(false);

    requestAnimationFrame(() => {
      setIsAnimating(true);

      setVisibleMonth(
        (current) =>
          new Date(
            current.getFullYear(),
            current.getMonth() + offset,
            1,
          ),
      );
    });
  };

  /*
   * Change month from the month selector.
   */
  const handleMonthChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const month = Number(event.target.value);

    setIsAnimating(true);

    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          month,
          1,
        ),
    );
  };

  /*
   * Change year from the year selector.
   */
  const handleYearChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const year = Number(event.target.value);

    setIsAnimating(true);

    setVisibleMonth(
      (current) =>
        new Date(
          year,
          current.getMonth(),
          1,
        ),
    );
  };

  /*
   * Select today's date.
   */
  const handleToday = () => {
    const today = new Date();

    onChange(formatDateValue(today));

    setVisibleMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    );

    setIsOpen(false);
  };

  /*
   * Select a date and immediately close the picker.
   */
  const handleDateSelect = (date: Date) => {
    onChange(formatDateValue(date));
    setIsOpen(false);
  };

  /*
   * Swipe navigation for mobile.
   *
   * Horizontal movement is considered a swipe only when
   * it is significantly larger than vertical movement.
   */
  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    const touch = event.changedTouches[0];

    touchStartX.current = touch.screenX;
    touchStartY.current = touch.screenY;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touch = event.changedTouches[0];

    const deltaX =
      touch.screenX - touchStartX.current;

    const deltaY =
      touch.screenY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    /*
     * Ignore vertical scrolling gestures.
     */
    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    /*
     * Minimum swipe distance.
     */
    if (Math.abs(deltaX) < 50) {
      return;
    }

    if (deltaX < 0) {
      changeMonth(1);
    } else {
      changeMonth(-1);
    }
  };

  const today = new Date();

  const currentYear = visibleMonth.getFullYear();
  const currentMonth = visibleMonth.getMonth();

  /*
   * Number of days in the active month.
   */
  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
  ).getDate();

  /*
   * Weekday of the first day.
   *
   * Sunday = 0
   * Monday = 1
   * ...
   * Saturday = 6
   */
  const firstWeekday = new Date(
    currentYear,
    currentMonth,
    1,
  ).getDay();

  /*
   * Keep the calendar as a complete 7-column grid.
   *
   * Cells before day 1 and after the final day are
   * intentionally null so dates from adjacent months
   * are never displayed.
   */
  const totalCells =
    Math.ceil(
      (firstWeekday + daysInMonth) / 7,
    ) * 7;

  const calendarDays = Array.from(
    { length: totalCells },
    (_, index) => {
      const dayNumber =
        index - firstWeekday + 1;

      if (
        dayNumber < 1 ||
        dayNumber > daysInMonth
      ) {
        return null;
      }

      return new Date(
        currentYear,
        currentMonth,
        dayNumber,
      );
    },
  );

  const yearOptions = Array.from(
    {
      length:
        YEAR_END -
        YEAR_START +
        1,
    },
    (_, index) => YEAR_START + index,
  );

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Field label */}
      {label && (
        <label
          className="mobile-field-label"
          htmlFor={id}
        >
          {label}{' '}
          {required && (
            <span className="text-gold-500">
              *
            </span>
          )}
        </label>
      )}

      {/* Date input / trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={
          label
            ? `Choose ${label}`
            : 'Choose date'
        }
        aria-invalid={error}
        onClick={openPicker}
        className={`mobile-field-input flex items-center justify-between gap-2 text-left ${
          error
            ? 'border-red-400 focus:ring-red-200'
            : ''
        }`}
      >
        <span
          className={
            value
              ? 'text-ink-900'
              : 'text-ink-300'
          }
        >
          {value || placeholder}
        </span>

        <CalendarDays
          className="h-4 w-4 shrink-0 text-ink-400"
          aria-hidden="true"
        />
      </button>

      {/* Calendar */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 z-40 mt-2 rounded-2xl border border-ink-200 bg-white p-3 shadow-card-lg"
          role="dialog"
          aria-label="Date picker"
        >
          {/* Calendar header */}
          <div className="mb-3 flex items-center justify-between gap-2">
            {/* Previous month */}
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition hover:bg-ink-50 focus:outline-none focus:ring-2 focus:ring-gold-200 active:scale-95"
              aria-label="Previous month"
            >
              <ChevronLeft
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>

            {/* Month + Year selectors */}
            <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
              <select
                aria-label="Select month"
                value={currentMonth}
                onChange={handleMonthChange}
                className="h-9 min-w-0 max-w-[125px] cursor-pointer appearance-none rounded-lg border border-ink-200 bg-white px-2.5 text-center text-sm font-semibold text-ink-800 shadow-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
              >
                {MONTHS.map(
                  (month, index) => (
                    <option
                      key={month}
                      value={index}
                    >
                      {month}
                    </option>
                  ),
                )}
              </select>

              <select
                aria-label="Select year"
                value={currentYear}
                onChange={handleYearChange}
                className="h-9 w-[82px] cursor-pointer appearance-none rounded-lg border border-ink-200 bg-white px-2 text-center text-sm font-semibold text-ink-800 shadow-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
              >
                {yearOptions.map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Next month */}
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition hover:bg-ink-50 focus:outline-none focus:ring-2 focus:ring-gold-200 active:scale-95"
              aria-label="Next month"
            >
              <ChevronRight
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Weekdays + dates */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`select-none transition-opacity ${
              isAnimating
                ? 'animate-[calendarFadeIn_0.2s_ease]'
                : ''
            }`}
          >
            {/* Weekday names */}
            <div className="mb-1 grid grid-cols-7 text-center">
              {WEEKDAYS.map(
                (weekday) => (
                  <span
                    key={weekday}
                    className="py-1 text-[11px] font-semibold text-ink-400"
                  >
                    {weekday}
                  </span>
                ),
              )}
            </div>

            {/* Date grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(
                (date, index) => {
                  /*
                   * Empty leading/trailing cells.
                   * No adjacent-month dates are rendered.
                   */
                  if (!date) {
                    return (
                      <span
                        key={`empty-${index}`}
                        className="h-10 w-10"
                        aria-hidden="true"
                      />
                    );
                  }

                  const isSelected =
                    isSameDate(
                      selectedDate,
                      date,
                    );

                  const isToday =
                    isSameDate(
                      today,
                      date,
                    );

                  /*
                   * When a date is selected:
                   *   selected date = green
                   *
                   * When no date is selected:
                   *   today = green
                   */

                  const isSunday = date.getDay() === 0;
                  
                  const isHighlighted =
                    isSelected ||
                    (!selectedDate &&
                      isToday);

                  return (
                    <button
                      key={formatDateValue(
                        date,
                      )}
                      type="button"
                      onClick={() =>
                        handleDateSelect(
                          date,
                        )
                      }
                      aria-label={date.toLocaleDateString(
                        'en-US',
                        {
                          dateStyle:
                            'full',
                        },
                      )}
                      aria-pressed={
                        isSelected
                      }


                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-green-200 active:scale-95 ${
                    isHighlighted
                        ? 'border-green-500 bg-green-500 font-semibold text-white hover:bg-green-600'
                        : isSunday
                        ? 'border-ink-200 bg-ink-50 text-red-500 hover:bg-ink-100'
                        : 'border-ink-200 bg-ink-50 text-ink-700 hover:bg-ink-100'
                    }`}


                    >
                      {date.getDate()}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-100 pt-3">
            {/* Today */}
            <button
              type="button"
              onClick={handleToday}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-green-500 px-3 text-sm font-semibold text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 active:scale-[0.98]"
            >
              Today
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              className="flex h-10 w-full items-center justify-center rounded-lg bg-ink-100 px-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-200 focus:outline-none focus:ring-2 focus:ring-ink-200 active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
