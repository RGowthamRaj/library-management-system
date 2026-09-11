import { BookOpen, BookCheck, BookX, AlertTriangle } from 'lucide-react';

export default function Dashboard({ stats }) {
  const cards = [
    {
      label: 'Total Books',
      value: stats.totalBooks || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Available Copies',
      value: stats.totalAvailable || 0,
      icon: BookCheck,
      color: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Issued Copies',
      value: stats.totalIssued || 0,
      icon: BookX,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Overdue Books',
      value: stats.overdueBooks || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className={`text-3xl font-bold mt-1 ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.bgLight} p-3 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
