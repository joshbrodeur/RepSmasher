import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Zap, Weight, Clock, Play } from 'lucide-react';

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

interface WorkoutStats {
  bestWorkout: {
    maxRepsPerMinute: number;
    workoutName: string;
    date: string;
  };
  exerciseStats: Array<{
    name: string;
    maxReps: number;
    maxWeight: number;
    minRestEstimate: number; // in seconds
  }>;
}

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  workouts: Workout[];
  onStartWorkout: () => void;
}

export function WorkoutDetailModal({ isOpen, onClose, workoutName, workouts, onStartWorkout }: WorkoutDetailModalProps) {
  // Filter workouts by name
  const relatedWorkouts = workouts.filter(w => w.name === workoutName);
  
  if (relatedWorkouts.length === 0) {
    return null;
  }

  // Calculate workout stats
  const calculateWorkoutStats = (): WorkoutStats => {
    let bestWorkout = {
      maxRepsPerMinute: 0,
      workoutName: '',
      date: ''
    };

    // Find best workout (max reps per minute)
    relatedWorkouts.forEach(workout => {
      const totalReps = workout.exercises.reduce((total, ex) => total + (ex.sets * ex.reps), 0);
      const repsPerMinute = workout.duration ? totalReps / workout.duration : 0;
      
      if (repsPerMinute > bestWorkout.maxRepsPerMinute) {
        bestWorkout = {
          maxRepsPerMinute: repsPerMinute,
          workoutName: workout.name,
          date: workout.date
        };
      }
    });

    // Calculate exercise stats
    const exerciseMap = new Map<string, {
      maxReps: number;
      maxWeight: number;
      minRestEstimate: number;
    }>();

    relatedWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const existing = exerciseMap.get(exercise.name) || {
          maxReps: 0,
          maxWeight: 0,
          minRestEstimate: 300 // 5 minutes default
        };

        exerciseMap.set(exercise.name, {
          maxReps: Math.max(existing.maxReps, exercise.reps),
          maxWeight: Math.max(existing.maxWeight, exercise.weight),
          minRestEstimate: Math.min(existing.minRestEstimate, 60) // Estimate 60 seconds min rest
        });
      });
    });

    const exerciseStats = Array.from(exerciseMap.entries()).map(([name, stats]) => ({
      name,
      ...stats
    }));

    return { bestWorkout, exerciseStats };
  };

  const stats = calculateWorkoutStats();
  const latestWorkout = relatedWorkouts[relatedWorkouts.length - 1];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-blue-50 border-0 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            {workoutName}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            View detailed workout statistics and performance metrics
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Best Workout Performance */}
          <Card className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Best Performance</h3>
                <p className="text-yellow-100 text-sm">
                  {stats.bestWorkout.maxRepsPerMinute.toFixed(1)} reps/min
                </p>
                <p className="text-yellow-100 text-xs">
                  {new Date(stats.bestWorkout.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Exercise Statistics */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Exercise Records
            </h3>
            <div className="space-y-3">
              {stats.exerciseStats.map((exercise, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-2">{exercise.name}</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="font-semibold text-slate-800">{exercise.maxReps}</p>
                      <p className="text-slate-600 text-xs">Max Reps</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Weight className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="font-semibold text-slate-800">{exercise.maxWeight}lbs</p>
                      <p className="text-slate-600 text-xs">Max Weight</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="font-semibold text-slate-800">{exercise.minRestEstimate}s</p>
                      <p className="text-slate-600 text-xs">Min Rest</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Workout Summary */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3">Workout Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Total Sessions</p>
                <p className="font-semibold text-slate-800">{relatedWorkouts.length}</p>
              </div>
              <div>
                <p className="text-slate-600">Avg Duration</p>
                <p className="font-semibold text-slate-800">
                  {Math.round(relatedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / relatedWorkouts.length)}m
                </p>
              </div>
              <div>
                <p className="text-slate-600">Total Exercises</p>
                <p className="font-semibold text-slate-800">{stats.exerciseStats.length}</p>
              </div>
              <div>
                <p className="text-slate-600">Last Done</p>
                <p className="font-semibold text-slate-800">
                  {new Date(latestWorkout.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Start Workout Button */}
          <Button 
            onClick={() => {
              onStartWorkout();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 shadow-lg transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Start {workoutName}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}