import { forwardRef } from 'react';
import LogOutIcon from '../svg/LogOutIcon';
import { useAuthContext } from '~/hooks/AuthContext';
import { useTranslation } from 'react-i18next';

const Logout = forwardRef(() => {
  const { user, logout } = useAuthContext();
  const { t, i18n } = useTranslation();
  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <button
      className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-700"
      onClick={handleLogout}
    >
      <LogOutIcon />
      {user?.username || 'USER'}
      <small>{t("logOut")}</small>
    </button>
  );
});

export default Logout;
