const LoadingSpinner = ({ size = 'md', color = 'orange', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  const colors = {
    orange: 'border-orange-500',
    gray: 'border-gray-500',
    white: 'border-white',
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizes[size]} ${colors[color]} ${className}`} />
  );
};

export default LoadingSpinner;