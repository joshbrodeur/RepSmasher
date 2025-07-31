export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component
      className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-md p-4 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
