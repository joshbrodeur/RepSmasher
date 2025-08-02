import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Play, Pause, SkipForward, Check, Plus, Minus, Trophy, Zap, Clock, Target } from 'lucide-react';

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  calories?: number;
}

interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  restPeriods?: Array<{
    id: string;
    duration: number;
  }>;
}

interface RunWorkoutScreenProps {
  workout: Workout;
  onCompleteWorkout: (completedWorkout: any) => void;
  onExit: () => void;
}

type WorkoutState = 'ready' | 'active' | 'resting' | 'completed';

interface ExerciseSession {
  exerciseIndex: number;
  currentSet: number;
  actualReps: number;
  actualWeight: number;
  completed: boolean;
}

export function RunWorkoutScreen({ workout, onCompleteWorkout, onExit }: RunWorkoutScreenProps) {
  const [workoutState, setWorkoutState] = useState<WorkoutState>('ready');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalTime, setTotalTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [exerciseSessions, setExerciseSessions] = useState<ExerciseSession[]>([]);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [levelUp, setLevelUp] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets, 0);
  const completedSets = exerciseSessions.reduce((total, session) => total + (session.completed ? session.currentSet : 0), 0);
  const progress = (completedSets / totalSets) * 100;

  // Initialize exercise sessions
  useEffect(() => {
    if (exerciseSessions.length === 0) {
      const sessions = workout.exercises.map((exercise, index) => ({
        exerciseIndex: index,
        currentSet: 1,
        actualReps: exercise.reps,
        actualWeight: exercise.weight,
        completed: false
      }));
      setExerciseSessions(sessions);
      setCurrentReps(workout.exercises[0]?.reps || 0);
      setCurrentWeight(workout.exercises[0]?.weight || 0);
    }
  }, [workout.exercises, exerciseSessions.length]);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (workoutState === 'active') {
          setTotalTime(prev => prev + 1);
        } else if (workoutState === 'resting') {
          setRestTime(prev => {
            if (prev <= 1) {
              setWorkoutState('active');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, workoutState]);

  const startWorkout = () => {
    setWorkoutState('active');
    setIsTimerRunning(true);
  };

  const pauseWorkout = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const completeSet = () => {
    const updatedSessions = [...exerciseSessions];
    const currentSession = updatedSessions[currentExerciseIndex];
    
    // Update current session
    currentSession.actualReps = currentReps;
    currentSession.actualWeight = currentWeight;
    
    // Calculate XP for this set
    const setXP = Math.round((currentReps * currentWeight * 0.1) + 10);
    setXpGained(prev => prev + setXP);
    
    if (currentSet >= currentExercise.sets) {
      // Exercise completed
      currentSession.completed = true;
      
      if (currentExerciseIndex >= workout.exercises.length - 1) {
        // Workout completed
        completeWorkout();
        return;
      }
      
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setCurrentReps(workout.exercises[currentExerciseIndex + 1]?.reps || 0);
      setCurrentWeight(workout.exercises[currentExerciseIndex + 1]?.weight || 0);
      
      // Start rest period
      startRest();
    } else {
      // Move to next set
      setCurrentSet(prev => prev + 1);
      startRest();
    }
    
    setExerciseSessions(updatedSessions);
    
    // Check for level up
    if (xpGained > 0 && xpGained % 100 === 0) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 3000);
    }
  };

  const skipSet = () => {
    if (currentSet >= currentExercise.sets) {
      if (currentExerciseIndex >= workout.exercises.length - 1) {
        completeWorkout();
        return;
      }
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setCurrentReps(workout.exercises[currentExerciseIndex + 1]?.reps || 0);
      setCurrentWeight(workout.exercises[currentExerciseIndex + 1]?.weight || 0);
    } else {
      setCurrentSet(prev => prev + 1);
    }
    
    startRest();
  };

  const startRest = () => {
    setWorkoutState('resting');
    setRestTime(60); // 60 second rest
  };

  const skipRest = () => {
    setWorkoutState('active');
    setRestTime(0);
  };

  const completeWorkout = () => {
    setWorkoutState('completed');
    setIsTimerRunning(false);
    
    const completedWorkout = {
      ...workout,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      duration: Math.round(totalTime / 60),
      exercises: exerciseSessions.map((session, index) => ({
        ...workout.exercises[index],
        sets: session.currentSet,
        reps: session.actualReps,
        weight: session.actualWeight
      }))
    };
    
    onCompleteWorkout(completedWorkout);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateReps = (delta: number) => {
    setCurrentReps(prev => Math.max(0, prev + delta));
  };

  const updateWeight = (delta: number) => {
    setCurrentWeight(prev => Math.max(0, prev + delta));
  };

  if (workoutState === 'ready') {
    return (
      <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Start
            </h1>
            <h2 className="text-xl font-semibold text-slate-700 mt-2">{workout.name}</h2>
          </div>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="space-y-4">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Workout Overview</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{workout.exercises.length}</p>
                  <p className="text-sm text-slate-600">Exercises</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalSets}</p>
                  <p className="text-sm text-slate-600">Total Sets</p>
                </div>
              </div>

              <div className="space-y-2">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-800">{exercise.name}</span>
                    <Badge variant="secondary">{exercise.sets} × {exercise.reps}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onExit}
              className="flex-1 border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={startWorkout}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Workout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (workoutState === 'completed') {
    return (
      <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Workout Complete!
            </h1>
            <p className="text-slate-600 mt-2">Excellent work on {workout.name}</p>
          </div>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{formatTime(totalTime)}</p>
                  <p className="text-sm text-slate-600">Total Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{xpGained}</p>
                  <p className="text-sm text-slate-600">XP Gained</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
                  <p className="font-semibold">Level Up!</p>
                  <p className="text-sm text-yellow-100">You're getting stronger!</p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            onClick={onExit}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Level Up Animation */}
        {levelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="p-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center animate-bounce">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">LEVEL UP!</h2>
              <p>+{xpGained} XP</p>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {workout.name}
          </h1>
          <p className="text-slate-600">{formatTime(totalTime)} elapsed</p>
        </div>

        {/* Progress */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-800">Workout Progress</span>
              <Badge variant="secondary">{completedSets}/{totalSets} sets</Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-slate-600">
              <span>Exercise {currentExerciseIndex + 1} of {workout.exercises.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </Card>

        {/* Rest Timer */}
        {workoutState === 'resting' && (
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg text-center">
            <div className="space-y-4">
              <Clock className="w-12 h-12 mx-auto" />
              <div>
                <h3 className="text-xl font-bold">Rest Time</h3>
                <p className="text-3xl font-bold">{formatTime(restTime)}</p>
              </div>
              <Button
                onClick={skipRest}
                variant="secondary"
                className="bg-white/20 text-white border-0 hover:bg-white/30"
              >
                Skip Rest
              </Button>
            </div>
          </Card>
        )}

        {/* Current Exercise */}
        {workoutState === 'active' && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentExercise.name}</h2>
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  Set {currentSet} of {currentExercise.sets}
                </Badge>
              </div>

              {/* Reps Control */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Reps</label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateReps(-1)}
                    className="w-10 h-10 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={currentReps}
                    onChange={(e) => setCurrentReps(parseInt(e.target.value) || 0)}
                    className="text-center text-2xl font-bold bg-white/50 border-slate-200"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateReps(1)}
                    className="w-10 h-10 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Weight Control */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Weight (lbs)</label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateWeight(-5)}
                    className="w-10 h-10 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                    className="text-center text-2xl font-bold bg-white/50 border-slate-200"
                    step="0.5"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateWeight(5)}
                    className="w-10 h-10 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* XP Preview */}
              <div className="text-center p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    +{Math.round((currentReps * currentWeight * 0.1) + 10)} XP for this set
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        {workoutState === 'active' && (
          <div className="space-y-3">
            <Button
              onClick={completeSet}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4"
            >
              <Check className="w-5 h-5 mr-2" />
              Complete Set
            </Button>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={pauseWorkout}
                className="border-slate-200"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={skipSet}
                className="border-slate-200"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onExit}
                className="border-slate-200 text-red-600 hover:text-red-700"
              >
                Exit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}