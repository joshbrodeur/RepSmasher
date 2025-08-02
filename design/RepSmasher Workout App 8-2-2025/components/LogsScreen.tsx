import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, Flame } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  date: string;
  duration?: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
    calories?: number;
  }>;
}

interface LogsScreenProps {
  workouts: Workout[];
}

export function LogsScreen({ workouts }: LogsScreenProps) {
  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RepSmasher
          </h1>
          <h2 className="text-xl font-semibold text-slate-700 mt-2">Workout Logs</h2>
        </div>
        
        {/* Workout List */}
        <div className="space-y-4">
          {sortedWorkouts.length === 0 ? (
            <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <div className="text-slate-400 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="font-semibold text-slate-700 mb-2">No workouts yet</h3>
              <p className="text-slate-500">Create your first workout to get started on your fitness journey!</p>
            </Card>
          ) : (
            sortedWorkouts.map((workout) => {
              const totalCalories = workout.exercises.reduce((total, ex) => 
                total + ((ex.calories || 0) * ex.sets), 0
              );
              
              return (
                <Card key={workout.id} className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-800">{workout.name}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center text-slate-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="text-sm">{new Date(workout.date).toLocaleDateString()}</span>
                          </div>
                          {workout.duration && (
                            <div className="flex items-center text-slate-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm">{workout.duration}m</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {totalCalories > 0 && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0">
                          <Flame className="w-3 h-3 mr-1" />
                          {totalCalories} cal
                        </Badge>
                      )}
                    </div>
                    
                    {/* Exercises */}
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between items-center bg-slate-50 rounded-lg p-2">
                          <div>
                            <span className="font-medium text-slate-800">{exercise.name}</span>
                            <div className="text-sm text-slate-600">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight > 0 && ` @ ${exercise.weight}lbs`}
                            </div>
                          </div>
                          {exercise.calories && (
                            <div className="text-xs text-orange-600 font-medium">
                              {exercise.calories * exercise.sets} cal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}