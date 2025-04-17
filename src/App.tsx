import { useEffect } from 'react';
import { MantineProvider, AppShell, Tabs, Grid, Paper, Text, Button, Progress, Badge, Notification } from '@mantine/core';
import { useGameState } from './hooks/useGameState';
import { useAchievements } from './hooks/useAchievements';
import WebApp from '@twa-dev/sdk';
import './App.css';
import type { Department, Employee, Research, Notification as GameNotification } from './types/game';

function App() {
  const { gameState, hireEmployee, upgradeDepartment, startResearch, updateGameState } = useGameState();
  const { achievements, isAchievementUnlocked } = useAchievements(gameState, updateGameState);

  useEffect(() => {
    // Инициализация Telegram WebApp
    WebApp.ready();
    WebApp.expand();

    // Настраиваем цвета под тему Telegram
    document.documentElement.style.setProperty(
      '--tg-theme-bg-color',
      WebApp.themeParams.bg_color || '#1a1b1e'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-text-color',
      WebApp.themeParams.text_color || '#ffffff'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-button-color',
      WebApp.themeParams.button_color || '#2f96ec'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-button-text-color',
      WebApp.themeParams.button_text_color || '#ffffff'
    );

    // Настраиваем кнопку "Назад"
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => {
      WebApp.close();
    });

    // Отключаем главную кнопку, так как у нас свой интерфейс
    WebApp.MainButton.hide();
  }, []);

  const getTraitColor = (trait: string) => {
    switch (trait) {
      case 'Креативный': return 'pink';
      case 'Трудоголик': return 'green';
      case 'Ленивый': return 'red';
      case 'Меметичный': return 'violet';
      case 'Вдохновлённый': return 'yellow';
      case 'Социальный': return 'blue';
      case 'Интроверт': return 'gray';
      case 'Экстраверт': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <MantineProvider theme={{
      primaryColor: 'cyan',
      colors: {
        dark: [
          '#C1C2C5',
          '#A6A7AB',
          '#909296',
          '#5C5F66',
          '#373A40',
          '#2C2E33',
          '#25262B',
          '#1A1B1E',
          '#141517',
          '#101113',
        ],
      },
    }}>
      <AppShell padding="md">
        {/* Notifications */}
        <div className="notifications-container">
          {gameState.notifications.map((notification: GameNotification) => (
            <Notification
              key={notification.id}
              color={notification.type === 'success' ? 'green' : 
                     notification.type === 'error' ? 'red' : 
                     notification.type === 'warning' ? 'yellow' : 'blue'}
              className="game-notification"
            >
              {notification.message}
            </Notification>
          ))}
        </div>

        <div className="stats-header">
          <Grid>
            <Grid.Col span={6}>
              <Paper p="xs" withBorder>
                <Text size="lg">💰 {Math.floor(gameState.company.money)}$</Text>
                <Text size="sm">Доход: {(gameState.company.memesPerSecond * 0.1).toFixed(1)}$/сек</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper p="xs" withBorder>
                <Text size="lg">🎭 Мемы: {Math.floor(gameState.company.memesProduced)}</Text>
                <Text size="sm">Производство: {gameState.company.memesPerSecond.toFixed(1)}/сек</Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </div>

        <Tabs defaultValue="departments" mt="md">
          <Tabs.List>
            <Tabs.Tab value="departments">Департаменты</Tabs.Tab>
            <Tabs.Tab value="employees">Сотрудники</Tabs.Tab>
            <Tabs.Tab value="research">Исследования</Tabs.Tab>
            <Tabs.Tab value="achievements">Достижения</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="departments" pt="xs">
            <Grid>
              {gameState.departments.map((dept: Department) => (
                <Grid.Col key={dept.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Paper p="md" withBorder>
                    <Text size="lg" fw={500}>{dept.name}</Text>
                    <Text size="sm">Уровень: {dept.level}</Text>
                    <Text size="sm">Продуктивность: {(dept.productivity * 100).toFixed(0)}%</Text>
                    <Text size="sm">Сотрудников: {dept.employees.length}</Text>
                    <Button 
                      fullWidth 
                      mt="sm"
                      disabled={gameState.company.money < dept.cost}
                      onClick={() => upgradeDepartment(dept.id)}
                    >
                      Улучшить ({dept.cost}$)
                    </Button>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="employees" pt="xs">
            <Grid>
              <Grid.Col span={12}>
                <Paper p="md" withBorder>
                  <Text mb="md">Нанять сотрудника:</Text>
                  <Grid>
                    <Grid.Col span={4}>
                      <Button 
                        fullWidth
                        onClick={() => hireEmployee('memologist')}
                        disabled={gameState.company.money < 800}
                      >
                        Мемолог (800$)
                      </Button>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Button
                        fullWidth
                        onClick={() => hireEmployee('designer')}
                        disabled={gameState.company.money < 1000}
                      >
                        Дизайнер (1000$)
                      </Button>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Button
                        fullWidth
                        onClick={() => hireEmployee('marketer')}
                        disabled={gameState.company.money < 1200}
                      >
                        Маркетолог (1200$)
                      </Button>
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Grid.Col>
              
              {gameState.employees.map((emp: Employee) => (
                <Grid.Col key={emp.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Paper p="md" withBorder>
                    <Text size="lg">{emp.name}</Text>
                    <Badge color={getTraitColor(emp.trait)} my="xs">
                      {emp.trait}
                    </Badge>
                    <Text size="sm" mb="xs">{emp.type}</Text>
                    <Text size="sm">Уровень: {emp.level}</Text>
                    <Text size="sm">Продуктивность: {(emp.productivity * 100).toFixed(0)}%</Text>
                    <Progress 
                      value={emp.happiness * 100} 
                      size="sm" 
                      mt="xs"
                      color={emp.happiness > 0.7 ? 'green' : emp.happiness > 0.4 ? 'yellow' : 'red'}
                    />
                    <Text size="xs" mt={5} ta="center">
                      Настроение: {(emp.happiness * 100).toFixed(0)}%
                    </Text>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="research" pt="xs">
            <Grid>
              {gameState.research.map((research: Research) => (
                <Grid.Col key={research.id} span={{ base: 12, sm: 6 }}>
                  <Paper p="md" withBorder>
                    <Text size="lg" fw={500}>{research.name}</Text>
                    <Text size="sm" c="dimmed">{research.description}</Text>
                    <Text size="sm" mt="xs">
                      Бонусы:
                      {research.benefits.map((b, i) => (
                        <span key={i}>
                          {' '}{b.type} +{((b.value - 1) * 100).toFixed(0)}%
                        </span>
                      ))}
                    </Text>
                    <Button
                      fullWidth
                      mt="sm"
                      disabled={research.completed || gameState.company.money < research.cost}
                      onClick={() => startResearch(research.id)}
                    >
                      {research.completed ? 'Завершено' : `Исследовать (${research.cost}$)`}
                    </Button>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="achievements" pt="xs">
            <Grid>
              {achievements.map(achievement => (
                <Grid.Col key={achievement.id} span={{ base: 12, sm: 6 }}>
                  <Paper p="md" withBorder 
                    style={{ 
                      opacity: isAchievementUnlocked(achievement.id) ? 1 : 0.7,
                      background: isAchievementUnlocked(achievement.id) 
                        ? 'rgba(39, 174, 96, 0.1)' 
                        : 'rgba(26, 27, 30, 0.9)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Text size="lg" fw={500}>{achievement.name}</Text>
                      {isAchievementUnlocked(achievement.id) && (
                        <Badge color="green">Получено!</Badge>
                      )}
                    </div>
                    <Text size="sm" c="dimmed" mt="xs">{achievement.description}</Text>
                    {achievement.reward && (
                      <Text size="sm" mt="xs" c="yellow">
                        Награда: {achievement.reward.type === 'money' 
                          ? `${achievement.reward.value}$` 
                          : `+${((achievement.reward.value - 1) * 100).toFixed(0)}% к ${
                            achievement.reward.type === 'productivity' ? 'продуктивности' : 'репутации'
                          }`}
                      </Text>
                    )}
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
