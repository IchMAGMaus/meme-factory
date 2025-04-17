export type EmployeeType = 'memologist' | 'designer' | 'marketer';
export type DepartmentType = 'SMM' | 'R&D' | 'PR';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Employee {
  id: string;
  type: EmployeeType;
  name: string;
  salary: number;
  level: number;
  productivity: number;
  happiness: number;
  trait: string;
}

export interface Department {
  id: string;
  name: DepartmentType;
  level: number;
  employees: Employee[];
  productivity: number;
  cost: number;
}

export interface Research {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number; // в секундах
  completed: boolean;
  benefits: {
    type: 'productivity' | 'income' | 'creativity';
    value: number;
  }[];
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  reward?: {
    type: 'money' | 'productivity' | 'reputation';
    value: number;
  };
}

export interface GameState {
  company: {
    name: string;
    level: number;
    reputation: number;
    money: number;
    memesProduced: number;
    memesPerSecond: number;
  };
  departments: Department[];
  employees: Employee[];
  research: Research[];
  stats: {
    totalIncome: number;
    totalExpenses: number;
    viralMemes: number;
    fanBase: number;
  };
  notifications: Notification[];
  achievements: Achievement[];
}