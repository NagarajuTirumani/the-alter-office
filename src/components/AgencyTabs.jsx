export default function TabStrip({
  items,
  activeIndex,
  onSelect,
  onRemove,
  onAdd,
  addLabel,
}) {
  return (
    <div
      style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          onClick={() => onSelect(i)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 20,
            border: "1px solid " + (activeIndex === i ? "#000" : "#ccc"),
            background: activeIndex === i ? "#000" : "transparent",
            color: activeIndex === i ? "#fff" : "#000",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            userSelect: "none",
          }}
        >
          {item.label}
          {items.length > 1 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onRemove(i);
              }}
              style={{ marginLeft: 2, cursor: "pointer", lineHeight: 1 }}
            >
              ✕
            </span>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px dashed #aaa",
          background: "transparent",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        {addLabel}
      </button>
    </div>
  );
}
