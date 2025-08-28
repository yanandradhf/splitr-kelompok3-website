import useAuthStore from '../../store/authStore';

const PageHeader = ({ title, subtitle, showUser = true }) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="px-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-24">
          <div className="flex flex-col ml-16">
            <span className="text-xl font-semibold text-gray-900">
              {title}
            </span>
            {subtitle && (
              <span className="text-sm text-gray-500 mt-1">
                {subtitle}
              </span>
            )}
          </div>
          {showUser && (
            <div className="pr-2 text-sm text-gray-600">
              Welcome, <span className="font-semibold text-orange-600">
                {user.name}
              </span>
            </div>
          )}
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden py-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-gray-900">
              {title}
            </span>
            {showUser && (
              <div className="text-xs text-gray-600">
                Welcome, <span className="font-semibold text-orange-600">
                  {user.name}
                </span>
              </div>
            )}
          </div>
          {subtitle && (
            <span className="text-sm text-gray-500 block">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;