const Skeleton = ({ className = '', width, height, rounded = false }) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  const roundedClass = rounded ? 'rounded-full' : 'rounded';
  
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  
  return (
    <div 
      className={`${baseClasses} ${roundedClass} ${className}`}
      style={style}
    />
  );
};

// Skeleton variants
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ${className}`}>
    <div className="flex items-center gap-4">
      <Skeleton width="40px" height="40px" rounded />
      <div className="flex-1">
        <Skeleton height="16px" className="mb-2" />
        <Skeleton height="24px" width="60%" />
      </div>
    </div>
  </div>
);

export const SkeletonChart = ({ height = "256px", className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <Skeleton height="20px" width="150px" />
      <Skeleton height="32px" width="100px" />
    </div>
    <Skeleton height={height} />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 9, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-100">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton height="16px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <Skeleton width="24px" height="24px" rounded />
          <div>
            <Skeleton height="16px" width="120px" className="mb-1" />
            <Skeleton height="12px" width="80px" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton height="16px" width="80px" className="mb-1" />
          <Skeleton height="12px" width="60px" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;