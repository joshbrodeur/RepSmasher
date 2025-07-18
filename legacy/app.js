// Utility functions for storage
function load(key, def) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : def;
}
function save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

// Data structures
let routines = load('routines', []);
let workouts = load('workouts', []);

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function updateStats() {
    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((a, w) => a + w.records.length, 0);
    const totalWeight = workouts.reduce((a, w) => a + w.records.reduce((b, r) => b + (r.weight*r.reps),0), 0);

    const statsEl = document.getElementById('stats');
    if (statsEl) {
        statsEl.innerHTML = `<p>Total Workouts: ${totalWorkouts}</p>` +
            `<p>Total Sets: ${totalSets}</p>` +
            `<p>Total Weight: ${totalWeight}</p>`;
    }
}

function saveRoutine(routine) {
    const idx = routines.findIndex(r => r.id === routine.id);
    if (idx >= 0) routines[idx] = routine; else routines.push(routine);
    save('routines', routines);
}

function addWorkoutLog(log) {
    workouts.push(log);
    save('workouts', workouts);
}

updateStats();
