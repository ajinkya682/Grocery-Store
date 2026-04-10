// src/components/ui/Badge.jsx
const colorMap = {
  green:   'bg-primary-100 text-primary-700 border border-primary-200',
  saffron: 'bg-saffron-100 text-saffron-600 border border-saffron-200',
  gold:    'bg-yellow-100 text-yellow-700 border border-yellow-200',
  blue:    'bg-blue-100 text-blue-700 border border-blue-200',
  red:     'bg-red-100 text-red-700 border border-red-200',
};

const Badge = ({ label, color = 'green', className = '' }) => {
  if (!label) return null;
  return (
    <span
      className={`
        inline-block text-[10px] font-bold uppercase tracking-wider
        px-2 py-0.5 rounded-full
        ${colorMap[color] || colorMap.green}
        ${className}
      `}
    >
      {label}
    </span>
  );
};

export default Badge;
