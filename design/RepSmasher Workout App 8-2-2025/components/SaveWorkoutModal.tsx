import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Save } from 'lucide-react';

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
  duration: number;
}

interface SaveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workoutName: string, exercises: Exercise[], restPeriods: RestPeriod[]) => void;
  exercises: Exercise[];
  restPeriods: RestPeriod[];
}

export function SaveWorkoutModal({ isOpen, onClose, onSave, exercises, restPeriods }: SaveWorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState('');

  const handleSave = () => {
    if (workoutName.trim()) {
      onSave(workoutName.trim(), exercises, restPeriods);
      setWorkoutName(''); // Reset for next time
      onClose();
    }
  };

  const handleClose = () => {
    setWorkoutName(''); // Reset when canceling
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-blue-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Save Workout
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Give your workout a name to save it
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Workout Name
            </label>
            <Input
              placeholder="Enter workout name..."
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="bg-white/50 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && workoutName.trim()) {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!workoutName.trim()}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}