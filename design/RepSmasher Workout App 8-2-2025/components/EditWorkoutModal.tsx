import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Edit, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

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

interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  workouts: Workout[];
  onEditWorkout: (workoutName: string) => void;
  onDuplicateWorkout: (workoutName: string) => void;
  onDeleteWorkout: (workoutName: string) => void;
}

export function EditWorkoutModal({ 
  isOpen, 
  onClose, 
  workoutName, 
  workouts, 
  onEditWorkout, 
  onDuplicateWorkout, 
  onDeleteWorkout 
}: EditWorkoutModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get the most recent workout with this name for preview info
  const recentWorkout = [...workouts]
    .filter(w => w.name === workoutName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const sessionsCount = workouts.filter(w => w.name === workoutName).length;

  const handleDelete = () => {
    onDeleteWorkout(workoutName);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleEdit = () => {
    onEditWorkout(workoutName);
    onClose();
  };

  const handleDuplicate = () => {
    onDuplicateWorkout(workoutName);
    onClose();
  };

  if (showDeleteConfirm) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-red-50 to-orange-50 border-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-700 text-center flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Delete Workout
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-red-200">
              <h3 className="font-semibold text-slate-800 mb-2">{workoutName}</h3>
              <p className="text-sm text-slate-600 mb-2">
                This will permanently delete the workout template and all {sessionsCount} recorded sessions.
              </p>
              <div className="text-xs text-red-600">
                • Workout template will be removed
                • All {sessionsCount} session logs will be deleted
                • This cannot be undone
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-blue-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Edit Workout
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Choose an action for {workoutName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Workout Info */}
          {recentWorkout && (
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">{workoutName}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Sessions</p>
                  <p className="font-semibold text-slate-800">{sessionsCount}</p>
                </div>
                <div>
                  <p className="text-slate-600">Exercises</p>
                  <p className="font-semibold text-slate-800">{recentWorkout.exercises.length}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleEdit}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 justify-start"
            >
              <Edit className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Edit Workout</div>
                <div className="text-xs text-blue-100">Modify exercises, sets, reps, and weights</div>
              </div>
            </Button>
            
            <Button
              onClick={handleDuplicate}
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 py-3 justify-start"
            >
              <Copy className="w-5 h-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-slate-800">Duplicate Workout</div>
                <div className="text-xs text-slate-600">Create a copy with a new name</div>
              </div>
            </Button>
            
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="w-full border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 py-3 justify-start"
            >
              <Trash2 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Delete Workout</div>
                <div className="text-xs text-red-500">Permanently remove this workout</div>
              </div>
            </Button>
          </div>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}