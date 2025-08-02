import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { SaveWorkoutModal } from './SaveWorkoutModal';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  calories?: number;
}

interface RestPeriod {
  id: string;
  duration: number; // in seconds
}

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
  restPeriods?: RestPeriod[];
}

interface EditWorkoutScreenProps {
  workoutName: string;
  workouts: Workout[];
  onSaveWorkout: (workoutName: string, exercises: Exercise[], restPeriods: RestPeriod[]) => void;
  onCancel: () => void;
  onDeleteOriginal?: () => void;
}

export function EditWorkoutScreen({ workoutName, workouts, onSaveWorkout, onCancel, onDeleteOriginal }: EditWorkoutScreenProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [restPeriods, setRestPeriods] = useState<RestPeriod[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workoutName);

  // Load the most recent workout data when component mounts
  useEffect(() => {
    const recentWorkout = [...workouts]
      .filter(w => w.name === workoutName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (recentWorkout) {
      // Convert workout exercises to Exercise format with IDs
      const convertedExercises: Exercise[] = recentWorkout.exercises.map((ex, index) => ({
        id: `exercise-${index}-${Date.now()}`,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        calories: ex.calories || 5
      }));

      setExercises(convertedExercises);

      // Convert rest periods or create defaults
      const convertedRestPeriods: RestPeriod[] = recentWorkout.restPeriods || [{
        id: `rest-${Date.now()}`,
        duration: 60
      }];

      setRestPeriods(convertedRestPeriods);
    }
  }, [workoutName, workouts]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 1,
      reps: 10,
      weight: 0,
      calories: 5
    };
    setExercises([...exercises, newExercise]);
  };

  const addRest = () => {
    const newRest: RestPeriod = {
      id: Date.now().toString(),
      duration: 60 // 1 minute default
    };
    setRestPeriods([...restPeriods, newRest]);
  };

  const handleSaveClick = () => {
    if (exercises.length > 0) {
      setShowSaveModal(true);
    }
  };

  const handleSaveWorkout = (newWorkoutName: string, exerciseData: Exercise[], restData: RestPeriod[]) => {
    onSaveWorkout(newWorkoutName, exerciseData, restData);
    
    // If the name changed and we have a delete function, delete the original
    if (newWorkoutName !== workoutName && onDeleteOriginal) {
      onDeleteOriginal();
    }
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const removeRest = (id: string) => {
    setRestPeriods(restPeriods.filter(rest => rest.id !== id));
  };

  return (
    <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RepSmasher
            </h1>
            <h2 className="text-xl font-semibold text-slate-700 mt-2">Edit Workout</h2>
          </div>
        </div>

        {/* Workout Name */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Workout Name
          </label>
          <Input
            placeholder="Enter workout name..."
            value={workoutTitle}
            onChange={(e) => setWorkoutTitle(e.target.value)}
            className="bg-white/50 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </Card>
        
        {/* Add Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={addExercise}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
          <Button 
            onClick={addRest}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rest
          </Button>
        </div>

        {/* Exercise List */}
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Exercise</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeExercise(exercise.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1"
                >
                  <X size={16} />
                </Button>
              </div>
              <Input
                placeholder="Exercise name"
                value={exercise.name}
                onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                className="bg-white/50 border-slate-200 focus:border-blue-400"
              />
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Sets</label>
                  <Input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                    min="1"
                    className="bg-white/50 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Reps</label>
                  <Input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                    min="1"
                    className="bg-white/50 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Weight</label>
                  <Input
                    type="number"
                    value={exercise.weight}
                    onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.5"
                    className="bg-white/50 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Cals</label>
                  <Input
                    type="number"
                    value={exercise.calories || 0}
                    onChange={(e) => updateExercise(exercise.id, 'calories', parseInt(e.target.value) || 0)}
                    min="0"
                    className="bg-white/50 border-slate-200"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Rest Periods List */}
        {restPeriods.map((rest) => (
          <Card key={rest.id} className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Rest Period</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeRest(rest.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1"
                >
                  <X size={16} />
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Duration (seconds)</label>
                <Input
                  type="number"
                  value={rest.duration}
                  onChange={(e) => setRestPeriods(restPeriods.map(r => 
                    r.id === rest.id ? { ...r, duration: parseInt(e.target.value) || 0 } : r
                  ))}
                  min="1"
                  className="bg-white/50 border-slate-200"
                />
              </div>
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {exercises.length === 0 && restPeriods.length === 0 && (
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <div className="text-slate-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-2">Start Building Your Workout</h3>
            <p className="text-slate-500 text-sm">Add exercises and rest periods to create your custom workout routine.</p>
          </Card>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveClick}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-200"
            disabled={exercises.length === 0}
          >
            Save Changes
          </Button>
        </div>

        {/* Save Workout Modal */}
        <SaveWorkoutModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveWorkout}
          exercises={exercises}
          restPeriods={restPeriods}
        />
      </div>
    </div>
  );
}