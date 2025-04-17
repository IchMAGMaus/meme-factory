import { useState, useEffect } from 'react';
import { GameState, Employee, EmployeeType } from '../types/game';

const EMPLOYEE_COSTS = {
  memologist: 800,
  designer: 1000,
  marketer: 1200
};

const EMPLOYEE_NAMES = [
  'Алекс', 'Саша', 'Женя', 'Валя', 'Юля', 'Дима',
  'Маша', 'Паша', 'Даша', 'Миша', 'Гриша', 'Нина'
];

const TRAITS = [
  'Креативный', 'Трудоголик', 'Ленивый', 'Меметичный',
  'Вдохновлённый', 'Социальный', 'Интроверт', 'Экстраверт'
];

const getRandomFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generateEmployee = (type: EmployeeType): Employee => {
  return {
    id: Date.now().toString(),
    type,
    name: getRandomFromArray(EMPLOYEE_NAMES),
    salary: EMPLOYEE_COSTS[type],
    level: 1,
    productivity: 1,
    happiness: Math.random() * 0.5 + 0.5,
    trait: getRandomFromArray(TRAITS)
  };
};

const EMPLOYEE_BASE_PRODUCTION = {
  memologist: 2,
  designer: 3,
  marketer: 4
};

const DEPARTMENT_MAPPING = {
  memologist: 'smm',
  designer: 'rd',
  marketer: 'pr'
} as const;

const INITIAL_STATE: GameState = {
  company: {
    name: 'Meme Factory',
    level: 1,
    reputation: 0,
    money: 1000,
    memesProduced: 0,
    memesPerSecond: 0
  },
  departments: [
    { id: 'smm', name: 'SMM', level: 1, employees: [], productivity: 1, cost: 1000 },
    { id: 'rd', name: 'R&D', level: 1, employees: [], productivity: 1, cost: 1500 },
    { id: 'pr', name: 'PR', level: 1, employees: [], productivity: 1, cost: 2000 }
  ],
  employees: [],
  research: [
    {
      id: 'viral-algorithms',
      name: 'Вирусные Алгоритмы',
      description: 'Улучшенные алгоритмы распространения мемов',
      cost: 5000,
      duration: 300,
      completed: false,
      benefits: [{ type: 'productivity', value: 1.5 }]
    },
    {
      id: 'ai-memes',
      name: 'ИИ Мемы',
      description: 'Использование ИИ для генерации мемов',
      cost: 10000,
      duration: 600,
      completed: false,
      benefits: [
        { type: 'productivity', value: 2.0 },
        { type: 'income', value: 1.3 }
      ]
    }
  ],
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    viralMemes: 0,
    fanBase: 0
  },
  notifications: [],
  achievements: []
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  useEffect(() => {
    const timer = setInterval(() => {
      updateGameLoop();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const updateGameLoop = () => {
    const newState = { ...gameState };
    
    // Обновляем производство мемов с учетом базовой продуктивности каждого типа сотрудников
    let totalProduction = 0;
    newState.departments.forEach(dept => {
      dept.employees.forEach(emp => {
        const baseProduction = EMPLOYEE_BASE_PRODUCTION[emp.type];
        totalProduction += baseProduction * dept.productivity * emp.productivity;
      });
    });
    
    newState.company.memesProduced += totalProduction;
    newState.company.memesPerSecond = totalProduction;
    newState.company.money += totalProduction * 0.1;
    
    // Обновляем счётчики
    newState.stats.totalIncome += totalProduction * 0.1;
    
    setGameState(newState);
  };

  const hireEmployee = (type: EmployeeType) => {
    const cost = EMPLOYEE_COSTS[type];
    
    if (gameState.company.money < cost) {
      setGameState({
        ...gameState,
        notifications: [
          {
            id: Date.now(),
            message: 'Недостаточно денег для найма!',
            type: 'error'
          },
          ...gameState.notifications
        ]
      });
      return;
    }

    const newEmployee = generateEmployee(type);
    const departmentId = DEPARTMENT_MAPPING[type];
    
    // Добавляем сотрудника в соответствующий департамент
    const newDepartments = gameState.departments.map(dept => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          employees: [...dept.employees, newEmployee]
        };
      }
      return dept;
    });
    
    setGameState({
      ...gameState,
      company: {
        ...gameState.company,
        money: gameState.company.money - cost
      },
      employees: [...gameState.employees, newEmployee],
      departments: newDepartments,
      notifications: [
        {
          id: Date.now(),
          message: `Нанят новый сотрудник: ${newEmployee.name}!`,
          type: 'success'
        },
        ...gameState.notifications
      ]
    });
  };

  const upgradeDepartment = (deptId: string) => {
    const dept = gameState.departments.find(d => d.id === deptId);
    if (!dept) return;

    if (gameState.company.money < dept.cost) {
      setGameState({
        ...gameState,
        notifications: [
          {
            id: Date.now(),
            message: 'Недостаточно денег для улучшения!',
            type: 'error'
          },
          ...gameState.notifications
        ]
      });
      return;
    }

    const newDepartments = gameState.departments.map(d => {
      if (d.id === deptId) {
        return {
          ...d,
          level: d.level + 1,
          productivity: d.productivity * 1.2,
          cost: Math.floor(d.cost * 1.5)
        };
      }
      return d;
    });

    setGameState({
      ...gameState,
      company: {
        ...gameState.company,
        money: gameState.company.money - dept.cost
      },
      departments: newDepartments,
      notifications: [
        {
          id: Date.now(),
          message: `Отдел ${dept.name} улучшен до уровня ${dept.level + 1}!`,
          type: 'success'
        },
        ...gameState.notifications
      ]
    });
  };

  const startResearch = (researchId: string) => {
    const research = gameState.research.find(r => r.id === researchId);
    if (!research || research.completed) return;

    if (gameState.company.money < research.cost) {
      setGameState({
        ...gameState,
        notifications: [
          {
            id: Date.now(),
            message: 'Недостаточно денег для исследования!',
            type: 'error'
          },
          ...gameState.notifications
        ]
      });
      return;
    }

    const newResearch = gameState.research.map(r => {
      if (r.id === researchId) {
        return { ...r, completed: true };
      }
      return r;
    });

    // Применяем бонусы
    const newDepartments = gameState.departments.map(dept => {
      let newProductivity = dept.productivity;
      research.benefits.forEach(benefit => {
        if (benefit.type === 'productivity') {
          newProductivity *= benefit.value;
        }
      });
      return { ...dept, productivity: newProductivity };
    });

    setGameState({
      ...gameState,
      company: {
        ...gameState.company,
        money: gameState.company.money - research.cost
      },
      research: newResearch,
      departments: newDepartments,
      notifications: [
        {
          id: Date.now(),
          message: `Исследование "${research.name}" завершено!`,
          type: 'success'
        },
        ...gameState.notifications
      ]
    });
  };

  const updateGameState = (newState: GameState) => {
    setGameState(newState);
  };

  return {
    gameState,
    hireEmployee,
    upgradeDepartment,
    startResearch,
    updateGameState
  };
};