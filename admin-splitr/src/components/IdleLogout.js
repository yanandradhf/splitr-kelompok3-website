import { useRouter } from "next/navigation";
import useIdleTimer from "../hooks/useIdleTimer";
import useAuthStore from "../store/authStore";

const IdleLogout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleIdle = () => {
    console.log("User idle for 2 minutes - auto logout");
    logout();
    router.push("/");
  };

  // 10 seconds = 10000ms (for testing)
  // ntuk kembalikan ke 2 menit: ganti 10000 jadi 120000
  useIdleTimer(handleIdle, 120000);

  return null; // This component doesn't render anything
};

export default IdleLogout;
