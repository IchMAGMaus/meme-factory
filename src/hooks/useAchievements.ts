import { useEffect } from 'react';
import { GameState, Achievement } from '../types/game';

const ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
  {
    id: 'first-employee',
    name: 'Первый наём!',
    description: 'Наймите первого сотрудника',
    reward: { type: 'money', value: 500 }
  },
  {
    id: 'meme-master',
    name: 'Мастер Мемов',
    description: 'Произведите 1000 мемов',
    reward: { type: 'productivity', value: 1.2 }
  },
  {
    id: 'department-guru',
    name: 'Корпоративный Гуру',
    description: 'Улучшите все департаменты до 3 уровня',
    reward: { type: 'reputation', value: 50 }
  },
  {
    id: 'research-complete',
    name: 'Учёный Мемолог',
    description: 'Завершите все исследования',
    reward: { type: 'productivity', value: 1.5 }
  },
  {
    id: 'team-builder',
    name: 'Командный Лидер',
    description: 'Наймите 10 сотрудников',
    reward: { type: 'money', value: 2000 }
  }
];

export const useAchievements = (
  gameState: GameState,
  setGameState: (state: GameState) => void
) => {
  useEffect(() => {
    checkAchievements();
  }, [
    gameState.employees.length,
    gameState.company.memesProduced,
    gameState.departments.map(d => d.level).join(','),
    gameState.research.map(r => r.completed).join(',')
  ]);

  const checkAchievements = () => {
    let updated = false;
    ACHIEVEMENTS.forEach(achievement => {
      if (isAchievementUnlocked(achievement.id)) return;
      if (checkAchievementCondition(achievement.id)) {
        unlockAchievement(achievement);
        updated = true;
      }
    });
    // Не мутируем gameState напрямую, setGameState вызывается только в unlockAchievement
  };

  const isAchievementUnlocked = (id: string): boolean => {
    // Проверяем только по id и unlocked
    return gameState.achievements.some(a => a.id === id && a.unlocked);
  };

  const checkAchievementCondition = (id: string): boolean => {
    switch (id) {
      case 'first-employee':
        return gameState.employees.length === 1;
      case 'meme-master':
        return gameState.company.memesProduced >= 1000;
      case 'department-guru':
        return gameState.departments.every(d => d.level >= 3);
      case 'research-complete':
        return gameState.research.every(r => r.completed);
      case 'team-builder':
        return gameState.employees.length >= 10;
      default:
        return false;
    }
  };

  const unlockAchievement = (achievement: Omit<Achievement, 'unlocked'>) => {
    // Создаём новые копии массивов и объектов
    const newAchievements = [
      ...gameState.achievements,
      { ...achievement, unlocked: true }
    ];
    const newCompany = { ...gameState.company };
    const newDepartments = gameState.departments.map(d => ({ ...d }));
    // Используем правильный тип для уведомления
    const newNotifications = [
      {
        id: Date.now(),
        message: `🏆 Достижение разблокировано: ${achievement.name}!`,
        type: 'success' as const
      },
      ...gameState.notifications
    ];
    // Применяем награду, если есть
    if (achievement.reward) {
      switch (achievement.reward.type) {
        case 'money':
          newCompany.money += achievement.reward.value;
          break;
        case 'productivity':
          newDepartments.forEach(dept => {
            dept.productivity *= achievement.reward ? achievement.reward.value : 1;
          });
          break;
        case 'reputation':
          newCompany.reputation += achievement.reward.value;
          break;
      }
    }
    setGameState({
      ...gameState,
      achievements: newAchievements,
      company: newCompany,
      departments: newDepartments,
      notifications: newNotifications
    });
  };

  return {
    achievements: gameState.achievements,
    isAchievementUnlocked
  };
};