import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Flame, Clock, Zap, Play, TrendingUp, Dumbbell } from 'lucide-react';

interface Statistics {
  totalWorkouts: number;
  totalSets: number;
  totalWeight: number;
  totalCalories: number;
  averageWorkoutTime: number;
  currentStreak: number;
  workoutDays: string[];
  lastWorkout: {
    name: string;
    duration?: number;
  } | null;
  uniqueWorkoutNames: string[];
}

interface HomeScreenProps {
  statistics: Statistics;
  onQuickWorkout: () => void;
  onWorkoutCardClick: (workoutName: string) => void;
}

export function HomeScreen({ statistics, onQuickWorkout, onWorkoutCardClick }: HomeScreenProps) {
  // Generate calendar grid for the last 49 days (7x7 grid)
  const generateActivityGrid = () => {
    const grid = [];
    const today = new Date();
    
    for (let i = 48; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const hasWorkout = statistics.workoutDays.includes(dateString);
      grid.push({
        date: dateString,
        hasWorkout
      });
    }
    
    return grid;
  };

  const activityGrid = generateActivityGrid();

  return (
    <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RepSmasher
          </h1>
          <p className="text-slate-600 mt-1">Crush your fitness goals</p>
        </div>

        {/* Quick Workout Button */}
        {statistics.lastWorkout && (
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">Quick Workout</h3>
                <p className="text-blue-100 text-sm">Repeat: {statistics.lastWorkout.name}</p>
                <p className="text-blue-100 text-xs">
                  {statistics.lastWorkout.duration ? `${statistics.lastWorkout.duration} min` : 'Ready to go!'}
                </p>
              </div>
              <Button
                onClick={onQuickWorkout}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
              >
                <Play className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        )}

        {/* Workout Cards */}
        {statistics.uniqueWorkoutNames.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
              <Dumbbell className="w-5 h-5 mr-2 text-blue-600" />
              Your Workouts
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {statistics.uniqueWorkoutNames.slice(0, 3).map((workoutName, index) => (
                <Card 
                  key={index}
                  className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                  onClick={() => onWorkoutCardClick(workoutName)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{workoutName}</h4>
                        <p className="text-sm text-slate-600">Tap to view stats</p>
                      </div>
                    </div>
                    <div className="text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statistics.currentStreak}</p>
                <p className="text-sm text-slate-600">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Zap className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statistics.totalCalories}</p>
                <p className="text-sm text-slate-600">Calories</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Grid */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Activity</h3>
            <span className="text-sm text-slate-600">Last 7 weeks</span>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {activityGrid.map((day, index) => (
              <div
                key={index}
                className={`
                  w-4 h-4 rounded-sm transition-colors
                  ${day.hasWorkout 
                    ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-sm' 
                    : 'bg-slate-200'
                  }
                `}
                title={new Date(day.date).toLocaleDateString()}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statistics.totalWorkouts}</p>
                <p className="text-sm text-slate-600">Workouts</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statistics.averageWorkoutTime}</p>
                <p className="text-sm text-slate-600">Avg Minutes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Stats Card */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <h3 className="font-semibold text-slate-800 mb-3">Workout Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Sets</span>
              <span className="font-semibold text-slate-800">{statistics.totalSets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Weight Moved</span>
              <span className="font-semibold text-slate-800">{statistics.totalWeight.toLocaleString()} lbs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Time</span>
              <span className="font-semibold text-slate-800">
                {Math.round(statistics.totalWorkouts * statistics.averageWorkoutTime / 60)}h {(statistics.totalWorkouts * statistics.averageWorkoutTime) % 60}m
              </span>
            </div>
          </div>
        </Card>

        {/* Motivational Message */}
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Keep it up!</h3>
            <p className="text-purple-100 text-sm">
              {statistics.currentStreak > 0 
                ? `You're on a ${statistics.currentStreak} day streak! Don't break the chain.`
                : "Ready to start your fitness journey? Create your first workout!"
              }
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}