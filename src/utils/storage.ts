
export const saveToStorage = (tasks: any[], users: any[], withdrawals: any[]) => {
  localStorage.setItem('easyEarnTasks', JSON.stringify(tasks));
  localStorage.setItem('easyEarnUsers', JSON.stringify(users));
  localStorage.setItem('easyEarnWithdrawals', JSON.stringify(withdrawals));
};
