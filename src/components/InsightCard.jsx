import { Lightbulb, AlertCircle, HelpCircle } from 'lucide-react';

const InsightCard = ({ title, description, type = 'neutral' }) => {
  const getIcon = () => {
    switch (type) {
      case 'positive': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'negative': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <HelpCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
       switch (type) {
      case 'positive': return 'bg-yellow-50 border-yellow-200';
      case 'negative': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getBgColor()} flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
         {getIcon()}
         <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default InsightCard;
