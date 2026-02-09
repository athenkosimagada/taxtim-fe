export default function StatsCard({ title, value }) {
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}
    >
      <strong>{title}</strong>
      <p>{value}</p>
    </div>
  );
}
