import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dumbbell, Play, Eye, Calendar, Clock, Zap, MoreVertical } from 'lucide-react';

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
  restPeriods?: Array<{
    id: string;
    duration: number;
  }>;
}

interface WorkoutsScreenProps {
  workouts: Workout[];
  onWorkoutCardClick: (workoutName: string) => void;
  onStartWorkout: (workoutName: string) => void;
  onEditWorkout: (workoutName: string) => void;
}

export function WorkoutsScreen({ workouts, onWorkoutCardClick, onStartWorkout, onEditWorkout }: WorkoutsScreenProps) {
  // Get unique workout templates (by name)
  const getUniqueWorkouts = () => {
    const workoutMap = new Map<string, {
      name: string;
      lastPerformed: string;
      totalSessions: number;
      averageDuration: number;
      totalExercises: number;
      estimatedCalories: number;
    }>();

    workouts.forEach(workout => {
      // Clean the workout name (remove suffixes like "(Quick)" or "(Started)")
      const cleanName = workout.name.replace(/ \(Quick\)$/, '').replace(/ \(Started\)$/, '');
      
      const existing = workoutMap.get(cleanName);
      const calories = workout.exercises.reduce((total, ex) => 
        total + ((ex.calories || 0) * ex.sets), 0
      );

      if (!existing) {
        workoutMap.set(cleanName, {
          name: cleanName,
          lastPerformed: workout.date,
          totalSessions: 1,
          averageDuration: workout.duration || 0,
          totalExercises: workout.exercises.length,
          estimatedCalories: calories
        });
      } else {
        const isMoreRecent = new Date(workout.date) > new Date(existing.lastPerformed);
        workoutMap.set(cleanName, {
          name: cleanName,
          lastPerformed: isMoreRecent ? workout.date : existing.lastPerformed,
          totalSessions: existing.totalSessions + 1,
          averageDuration: Math.round((existing.averageDuration * existing.totalSessions + (workout.duration || 0)) / (existing.totalSessions + 1)),
          totalExercises: workout.exercises.length, // Use most recent exercise count
          estimatedCalories: Math.round((existing.estimatedCalories * existing.totalSessions + calories) / (existing.totalSessions + 1))
        });
      }
    });

    return Array.from(workoutMap.values()).sort((a, b) => 
      new Date(b.lastPerformed).getTime() - new Date(a.lastPerformed).getTime()
    );
  };

  const uniqueWorkouts = getUniqueWorkouts();

  return (
    <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RepSmasher
          </h1>
          <h2 className="text-xl font-semibold text-slate-700 mt-2">My Workouts</h2>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Dumbbell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{uniqueWorkouts.length}</p>
                <p className="text-sm text-slate-600">Templates</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {uniqueWorkouts.reduce((total, w) => total + w.totalSessions, 0)}
                </p>
                <p className="text-sm text-slate-600">Total Sessions</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Workouts List */}
        {uniqueWorkouts.length > 0 ? (
          <div className="space-y-4">
            {uniqueWorkouts.map((workout, index) => (
              <Card 
                key={index}
                className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Workout Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{workout.name}</h3>
                        <p className="text-sm text-slate-600">
                          Last: {new Date(workout.lastPerformed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-700 border-0"
                      >
                        {workout.totalSessions} sessions
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditWorkout(workout.name)}
                        className="p-2 hover:bg-slate-100 rounded-full"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Workout Stats */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-slate-600" />
                      </div>
                      <p className="font-semibold text-slate-800">{workout.averageDuration}m</p>
                      <p className="text-slate-600 text-xs">Avg Time</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Dumbbell className="w-4 h-4 text-slate-600" />
                      </div>
                      <p className="font-semibold text-slate-800">{workout.totalExercises}</p>
                      <p className="text-slate-600 text-xs">Exercises</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Zap className="w-4 h-4 text-slate-600" />
                      </div>
                      <p className="font-semibold text-slate-800">{workout.estimatedCalories}</p>
                      <p className="text-slate-600 text-xs">Avg Cals</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onWorkoutCardClick(workout.name)}
                      className="flex-1 border-slate-200 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Stats
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onStartWorkout(workout.name)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="text-slate-400 mb-4">
              <Dumbbell className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-2">No Workouts Yet</h3>
            <p className="text-slate-500 text-sm mb-4">
              Create your first workout to get started on your fitness journey.
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              Create Workout
            </Button>
          </Card>
        )}

        {/* Tips Card */}
        {uniqueWorkouts.length > 0 && (
          <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Pro Tip</h3>
              <p className="text-purple-100 text-sm">
                Tap the menu icon (⋮) to edit, duplicate, or delete your workouts.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}