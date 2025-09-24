function NoteCard({ title, description }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem"
    }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export default NoteCard;
