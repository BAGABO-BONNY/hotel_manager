import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  minDate?: Date;
  label?: string;
  error?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  minDate = new Date(),
  label = 'Select Dates',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (dates: [Date | null, Date | null]) => {
    onChange(dates);
    if (dates[0] && dates[1]) {
      setIsOpen(false);
    }
  };

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div 
          className={`flex items-center justify-between px-3 py-2 bg-white border rounded-md cursor-pointer
                    ${error ? 'border-error-500' : 'border-gray-300'}`}
          onClick={toggleCalendar}
        >
          <div>
            {startDate && endDate ? (
              <span>
                {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
              </span>
            ) : (
              <span className="text-gray-400">Select check-in and check-out dates</span>
            )}
          </div>
          <Calendar size={20} className="text-gray-500" />
        </div>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md p-2 border border-gray-200">
            <DatePicker
              selected={startDate}
              onChange={handleChange}
              startDate={startDate}
              endDate={endDate}
              minDate={minDate}
              selectsRange
              inline
              monthsShown={2}
            />
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
    </div>
  );
};

export default DateRangePicker;