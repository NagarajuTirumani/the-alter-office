export default function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{message}</p>;
}
