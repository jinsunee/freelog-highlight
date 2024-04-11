const pallets = [
  {
    name: "blue",
    color: "#67c6e3",
  },
  {
    name: "orange",
    color: "#ffc374",
  },
  {
    name: "green",
    color: "#bfea7c",
  },
  {
    name: "red",
    color: "#eea5a6",
  },
  {
    name: "purple",
    color: "#b784b7",
  },
  {
    name: "brown",
    color: "#ecb159",
  },
  {
    name: "pink",
    color: "#e493b3",
  },
  {
    name: "grey",
    color: "#f0f0f0",
  },
  {
    name: "yellow",
    color: "#fff455",
  },
  {
    name: "skyblue",
    color: "#40a2e3",
  },
];

interface Props {
  onSelectColor: (theme: string) => void;
}

export default function HighlighterPallet({ onSelectColor }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        backgroundColor: "#101010",
        borderRadius: 5,
      }}
    >
      <div style={{ padding: 4 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {pallets.map((pallet) => (
            <div
              key={pallet.name}
              style={{
                backgroundColor: pallet.color,
                width: 24,
                height: 24,
                borderRadius: 3,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectColor(pallet.color);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
