function TodoItem({ task }) {
  return (
    <li style={{
      background: '#333',
      border: '1px solid #444',
      borderRadius: 6,
      padding: '8px 12px',
      marginBottom: 8,
      listStyle: 'none', // Remove bullet point
      textAlign: 'left',
    }}>
      {task}
    </li>
  );
}
export default TodoItem;