export function RetroGrid() {
  return (
    <div className="absolute inset-0" style={{ perspective: "500px" }}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary-foreground) 2px, transparent 2px),
            linear-gradient(90deg, var(--primary-foreground) 2px, transparent 2px)
          `,
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg)',
          animation: 'grid-scroll 20s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes grid-scroll {
            from {
              transform: rotateX(60deg) translateY(0);
            }
            to {
              transform: rotateX(60deg) translateY(40px);
            }
          }
        `}
      </style>
    </div>
  );
}