import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Layout({ children, fullWidth }: LayoutProps) {
  const { mode } = useThemeStore();
  const { loadUser } = useAuthStore();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className={`flex-1 pt-16 ${fullWidth ? '' : 'px-0'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}