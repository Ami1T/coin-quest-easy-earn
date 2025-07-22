
import { useState, useEffect } from 'react';

interface User {
  email: string;
  balance: number;
  upiId: string;
  type: "public" | "admin";
}

interface UserData {
  id: string;
  email: string;
  upiId: string;
  joinDate: string;
  totalEarnings: number;
  tasksCompleted: number;
  completedTaskIds: string[];
  isActive: boolean;
  lastActive: string;
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on mount
  useEffect(() => {
    const loadPersistedSession = () => {
      try {
        const persistedUser = localStorage.getItem('easyEarnCurrentUser');
        if (persistedUser) {
          const user = JSON.parse(persistedUser);
          
          // Verify user still exists in database
          const storedUsers = localStorage.getItem('easyEarnUsers');
          const users: UserData[] = storedUsers ? JSON.parse(storedUsers) : [];
          const existingUser = users.find(u => u.email === user.email);
          
          if (existingUser) {
            // Update user data with latest from database
            const updatedUser: User = {
              email: user.email,
              balance: existingUser.totalEarnings,
              upiId: existingUser.upiId,
              type: user.type
            };
            setCurrentUser(updatedUser);
          } else {
            // User no longer exists, clear session
            localStorage.removeItem('easyEarnCurrentUser');
          }
        }
      } catch (error) {
        console.error('Error loading persisted session:', error);
        localStorage.removeItem('easyEarnCurrentUser');
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedSession();
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    // Persist session
    localStorage.setItem('easyEarnCurrentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('easyEarnCurrentUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('easyEarnCurrentUser', JSON.stringify(updatedUser));
    }
  };

  return {
    currentUser,
    isLoading,
    login,
    logout,
    updateUser
  };
}
