import React from 'react';
import { Input } from '../../../components/ui/input';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (range: { start: Date; end: Date }) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center space-x-4">
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
          Date de début
        </label>
        <Input
          type="date"
          id="start-date"
          value={startDate.toISOString().split('T')[0]}
          onChange={(e) => onChange({
            start: new Date(e.target.value),
            end: endDate
          })}
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
          Date de fin
        </label>
        <Input
          type="date"
          id="end-date"
          value={endDate.toISOString().split('T')[0]}
          onChange={(e) => onChange({
            start: startDate,
            end: new Date(e.target.value)
          })}
          className="mt-1"
        />
      </div>
    </div>
  );
}