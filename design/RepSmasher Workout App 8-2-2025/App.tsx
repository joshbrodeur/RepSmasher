import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { CreateWorkoutScreen } from './components/CreateWorkoutScreen';
import { WorkoutsScreen } from './components/WorkoutsScreen';
import { EditWorkoutScreen } from './components/EditWorkoutScreen';
import { LogsScreen } from './components/LogsScreen';
import { RunWorkoutScreen } from './components/RunWorkoutScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { EditWorkoutModal } from './components/EditWorkoutModal';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  calories?: number; // calories burned per set
}

interface RestPeriod {
  id: string;
  duration: number;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  duration?: number; // workout duration in minutes
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
    calories?: number;
  }>;
  restPeriods?: RestPeriod[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'workouts' | 'logs'>('home');
  const [selectedWorkoutName, setSelectedWorkoutName] = useState<string | null>(null);
  const [editingWorkoutName, setEditingWorkoutName] = useState<string | null>(null);
  const [currentRunningWorkout, setCurrentRunningWorkout] = useState<Workout | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalWorkoutName, setEditModalWorkoutName] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1', 
      name: 'Upper Body Blast',
      date: '2025-01-31',
      duration: 45,
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 12, weight: 0, calories: 8 },
        { name: 'Pull-ups', sets: 3, reps: 8, weight: 0, calories: 10 },
        { name: 'Chest Press', sets: 4, reps: 10, weight: 80, calories: 12 }
      ]
    },
    {
      id: '2',
      name: 'Leg Day Power',
      date: '2025-01-29', 
      duration: 52,
      exercises: [
        { name: 'Squats', sets: 4, reps: 12, weight: 100, calories: 15 },
        { name: 'Lunges', sets: 3, reps: 10, weight: 20, calories: 12 }
      ]
    },
    {
      id: '3',
      name: 'Core Focus',
      date: '2025-01-27',
      duration: 30,
      exercises: [
        { name: 'Plank', sets: 3, reps: 1, weight: 0, calories: 8 },
        { name: 'Russian Twists', sets: 3, reps: 20, weight: 10, calories: 6 }
      ]
    },
    {
      id: '4',
      name: 'Upper Body Blast',
      date: '2025-01-25',
      duration: 40,
      exercises: [
        { name: 'Push-ups', sets: 4, reps: 15, weight: 0, calories: 8 },
        { name: 'Pull-ups', sets: 2, reps: 6, weight: 0, calories: 10 },
        { name: 'Chest Press', sets: 3, reps: 12, weight: 85, calories: 12 }
      ]
    }
  ]);

  const handleSaveWorkout = (workoutName: string, exercises: Exercise[], restPeriods: RestPeriod[]) => {
    // Estimate workout duration based on exercises and rest
    const exerciseTime = exercises.reduce((total, ex) => total + (ex.sets * 2), 0); // 2 mins per set average
    const restTime = restPeriods.reduce((total, rest) => total + (rest.duration / 60), 0);
    const estimatedDuration = Math.round(exerciseTime + restTime);

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString().split('T')[0],
      duration: estimatedDuration,
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        calories: ex.calories || Math.round(ex.sets * ex.reps * 0.5) // rough calorie estimate
      })),
      restPeriods
    };
    
    setWorkouts([...workouts, newWorkout]);
    setActiveTab('home');
  };

  const handleQuickWorkout = () => {
    if (workouts.length === 0) return;
    
    const lastWorkout = workouts[workouts.length - 1];
    const workoutToRun: Workout = {
      id: Date.now().toString(),
      name: lastWorkout.name,
      date: new Date().toISOString().split('T')[0],
      duration: lastWorkout.duration,
      exercises: lastWorkout.exercises,
      restPeriods: lastWorkout.restPeriods
    };
    
    setCurrentRunningWorkout(workoutToRun);
  };

  const handleStartWorkout = (workoutName: string) => {
    // Find the most recent workout with this name
    const recentWorkout = [...workouts]
      .filter(w => w.name === workoutName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (recentWorkout) {
      const workoutToRun: Workout = {
        id: Date.now().toString(),
        name: workoutName,
        date: new Date().toISOString().split('T')[0],
        duration: recentWorkout.duration,
        exercises: recentWorkout.exercises,
        restPeriods: recentWorkout.restPeriods
      };
      
      setCurrentRunningWorkout(workoutToRun);
      setSelectedWorkoutName(null); // Close modal
    }
  };

  const handleCompleteWorkout = (completedWorkout: Workout) => {
    setWorkouts([...workouts, completedWorkout]);
    setCurrentRunningWorkout(null);
    setActiveTab('home');
  };

  const handleExitWorkout = () => {
    setCurrentRunningWorkout(null);
  };

  // This function shows the edit modal when the edit button is clicked
  const handleEditWorkout = (workoutName: string) => {
    setEditModalWorkoutName(workoutName);
    setShowEditModal(true);
  };

  // This function is called when user chooses "Edit Workout" from the modal
  const handleEditWorkoutAction = (workoutName: string) => {
    setEditingWorkoutName(workoutName);
    setShowEditModal(false);
    setEditModalWorkoutName(null);
  };

  const handleDuplicateWorkout = (workoutName: string) => {
    const recentWorkout = [...workouts]
      .filter(w => w.name === workoutName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (recentWorkout) {
      const duplicatedWorkout: Workout = {
        id: Date.now().toString(),
        name: `${workoutName} Copy`,
        date: new Date().toISOString().split('T')[0],
        duration: recentWorkout.duration,
        exercises: recentWorkout.exercises,
        restPeriods: recentWorkout.restPeriods
      };
      
      setWorkouts([...workouts, duplicatedWorkout]);
    }
    setShowEditModal(false);
    setEditModalWorkoutName(null);
  };

  const handleDeleteWorkout = (workoutName: string) => {
    setWorkouts(workouts.filter(w => w.name !== workoutName));
    setShowEditModal(false);
    setEditModalWorkoutName(null);
  };

  const handleSaveEditedWorkout = (workoutName: string, exercises: Exercise[], restPeriods: RestPeriod[]) => {
    // This handles saving the edited workout
    handleSaveWorkout(workoutName, exercises, restPeriods);
    setEditingWorkoutName(null);
  };

  const handleDeleteOriginalWorkout = () => {
    if (editingWorkoutName) {
      setWorkouts(workouts.filter(w => w.name !== editingWorkoutName));
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkoutName(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditModalWorkoutName(null);
  };

  // Get unique workout names for cards
  const getUniqueWorkoutNames = (): string[] => {
    const names = workouts.map(w => w.name.replace(/ \(Quick\)$/, '').replace(/ \(Started\)$/, ''));
    return [...new Set(names)];
  };

  // Calculate comprehensive statistics
  const statistics = {
    totalWorkouts: workouts.length,
    totalSets: workouts.reduce((total, workout) => 
      total + workout.exercises.reduce((workoutSets, exercise) => workoutSets + exercise.sets, 0), 0
    ),
    totalWeight: workouts.reduce((total, workout) => 
      total + workout.exercises.reduce((workoutWeight, exercise) => 
        workoutWeight + (exercise.weight * exercise.sets * exercise.reps), 0
      ), 0
    ),
    totalCalories: workouts.reduce((total, workout) =>
      total + workout.exercises.reduce((workoutCals, exercise) =>
        workoutCals + ((exercise.calories || 0) * exercise.sets), 0
      ), 0
    ),
    averageWorkoutTime: workouts.length > 0 
      ? Math.round(workouts.reduce((total, workout) => total + (workout.duration || 0), 0) / workouts.length)
      : 0,
    currentStreak: calculateCurrentStreak(workouts),
    workoutDays: getWorkoutDays(workouts),
    lastWorkout: workouts.length > 0 ? workouts[workouts.length - 1] : null,
    uniqueWorkoutNames: getUniqueWorkoutNames()
  };

  // If there's a running workout, show the run workout screen
  if (currentRunningWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <RunWorkoutScreen
          workout={currentRunningWorkout}
          onCompleteWorkout={handleCompleteWorkout}
          onExit={handleExitWorkout}
        />
      </div>
    );
  }

  // If editing a workout, show the edit screen
  if (editingWorkoutName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <EditWorkoutScreen
          workoutName={editingWorkoutName}
          workouts={workouts}
          onSaveWorkout={handleSaveEditedWorkout}
          onCancel={handleCancelEdit}
          onDeleteOriginal={handleDeleteOriginalWorkout}
        />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            statistics={statistics} 
            onQuickWorkout={handleQuickWorkout}
            onWorkoutCardClick={setSelectedWorkoutName}
          />
        );
      case 'create':
        return <CreateWorkoutScreen onSaveWorkout={handleSaveWorkout} />;
      case 'workouts':
        return (
          <WorkoutsScreen
            workouts={workouts}
            onWorkoutCardClick={setSelectedWorkoutName}
            onStartWorkout={handleStartWorkout}
            onEditWorkout={handleEditWorkout}
          />
        );
      case 'logs':
        return <LogsScreen workouts={workouts} />;
      default:
        return (
          <HomeScreen 
            statistics={statistics} 
            onQuickWorkout={handleQuickWorkout}
            onWorkoutCardClick={setSelectedWorkoutName}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {renderActiveScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <WorkoutDetailModal
        isOpen={selectedWorkoutName !== null}
        onClose={() => setSelectedWorkoutName(null)}
        workoutName={selectedWorkoutName || ''}
        workouts={workouts}
        onStartWorkout={() => selectedWorkoutName && handleStartWorkout(selectedWorkoutName)}
      />

      <EditWorkoutModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        workoutName={editModalWorkoutName || ''}
        workouts={workouts}
        onEditWorkout={handleEditWorkoutAction}
        onDuplicateWorkout={handleDuplicateWorkout}
        onDeleteWorkout={handleDeleteWorkout}
      />
    </div>
  );
}

// Helper function to calculate current workout streak
function calculateCurrentStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }
  
  return streak;
}

// Helper function to get workout days for color grid
function getWorkoutDays(workouts: Workout[]): string[] {
  return workouts.map(workout => workout.date);
}