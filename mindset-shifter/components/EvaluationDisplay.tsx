import React from 'react';
import type { TransformedBeliefs } from '../types';
import { BrainIcon, HeartIcon, BoltIcon } from './icons';

interface BeliefsDisplayProps {
  beliefs: TransformedBeliefs;
}

const BeliefsDisplay: React.FC<BeliefsDisplayProps> = ({ beliefs }) => {
  const brainSections = [
    {
      title: 'Logic Brain (Lý trí)',
      icon: <BrainIcon className="w-8 h-8 mr-3 text-blue-500" />,
      data: beliefs.logic,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
    },
    {
      title: 'Emotion Brain (Cảm xúc)',
      icon: <HeartIcon className="w-8 h-8 mr-3 text-red-500" />,
      data: beliefs.emotion,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
    },
    {
      title: 'Animal Brain (Não thú)',
      icon: <BoltIcon className="w-8 h-8 mr-3 text-yellow-500" />,
      data: beliefs.animal,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full animate-fade-in space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Your New Empowering Beliefs</h2>
      {brainSections.map((section, index) => (
        <div key={index} className={`${section.bgColor} p-6 rounded-lg border-l-4 ${section.borderColor}`}>
          <h3 className={`text-xl font-bold flex items-center mb-4 ${section.textColor}`}>
            {section.icon}
            {section.title}
          </h3>
          <ul className="space-y-4">
            {section.data.map((belief, beliefIndex) => (
              <li key={beliefIndex} className="flex flex-col">
                <p className="text-slate-700 leading-relaxed">"{belief.text}"</p>
                <p className="text-slate-500 italic mt-1 leading-relaxed">{belief.translation}</p>
                <span className={`text-sm font-semibold ${section.textColor} self-end mt-2`}>
                  — {belief.tense}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BeliefsDisplay;