const counterElement = document.getElementById('counter');
const button = document.getElementById('repButton');
let count = 0;

button.addEventListener('click', () => {
  count += 1;
  counterElement.textContent = count.toString();
});
