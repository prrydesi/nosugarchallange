
import React, { useState } from 'react';
import { PlusIcon } from './icons';

interface AddParticipantFormProps {
  onAddParticipant: (name: string) => void;
}

const AddParticipantForm: React.FC<AddParticipantFormProps> = ({ onAddParticipant }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddParticipant(name.trim());
      setName('');
    }
  };

  return (
    <div className="p-4 sm:p-6 mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <label htmlFor="participant-name" className="sr-only">Enter friend's name</label>
          <input
            id="participant-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter friend's name..."
            className="flex-grow bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!name.trim()}
          >
            <PlusIcon className="w-6 h-6" />
            <span>Add Friend</span>
          </button>
        </form>
    </div>
  );
};

export default AddParticipantForm;