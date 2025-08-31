import React from 'react';

export const ConfigError: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-2xl w-full bg-slate-800 border border-red-500/50 rounded-xl p-8 text-center shadow-2xl shadow-red-500/10">
        <h1 className="text-3xl font-bold text-red-400 mb-4">Configuration Required</h1>
        <p className="text-slate-300 text-lg mb-2">
          Welcome to the No Sugar Streak Challenge!
        </p>
        <p className="text-slate-400 mb-6">
          To get started, you need to connect the app to your own Firebase database. Please copy your Firebase configuration object and paste it into the <code>firebase.ts</code> file.
        </p>
        <div className="text-left bg-slate-900 p-4 rounded-lg border border-slate-700">
          <code className="text-sm text-slate-400 whitespace-pre-wrap">
            <span className="text-sky-400">{'// In firebase.ts'}</span><br/>
            <span className="text-pink-400">const</span> firebaseConfig = {'{'}<br/>
            {'  '}apiKey: <span className="text-amber-400">"..."</span>,<br/>
            {'  '}authDomain: <span className="text-amber-400">"..."</span>,<br/>
            {'  '}databaseURL: <span className="text-amber-400">"..."</span>,<br/>
            {'  '}...<br/>
            {'};'}
          </code>
        </div>
        <p className="text-xs text-slate-500 mt-6">
          You can find this configuration in your Firebase project settings under "General". If you don't have a project, you can create one for free at <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">firebase.google.com</a>.
        </p>
      </div>
    </div>
  );
};
