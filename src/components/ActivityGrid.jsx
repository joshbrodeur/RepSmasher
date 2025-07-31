export default function ActivityGrid({ days }) {
  const generateGrid = () => {
    const grid = [];
    const today = new Date();

    for (let i = 48; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      grid.push({
        date: dateString,
        hasWorkout: days.includes(dateString),
      });
    }
    return grid;
  };

  const grid = generateGrid();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="font-semibold mb-2">Activity (Last 7 weeks)</h3>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, idx) => (
          <div
            key={idx}
            title={day.date}
            className={`w-4 h-4 rounded-sm ${day.hasWorkout ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  );
}
