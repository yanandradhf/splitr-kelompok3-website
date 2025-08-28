import useAuthStore from '../../store/authStore';

const PageHeader = ({ title, subtitle, showUser = true }) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="px-6">
        <div className="flex justify-between items-center h-24">
          <div className="flex flex-col ml-4 md:ml-16">
            <span className="text-lg md:text-xl font-semibold text-gray-900">
              {title}
            </span>
            {subtitle && (
              <span className="text-xs md:text-sm text-gray-500 mt-1">
                {subtitle}
              </span>
            )}
          </div>
          {showUser && (
            <div className="pr-2 text-xs md:text-sm text-gray-600">
              Welcome, <span className="font-semibold text-orange-600">
                {user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;