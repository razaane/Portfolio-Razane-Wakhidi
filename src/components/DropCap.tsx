// Magazine drop cap. The first letter is wrapped by hand because ::first-letter would also
// grab the apostrophe in "I'm".
export function DropCap({ text }: { text: string }) {
  return (
    <>
      <span className="dropcap">{text[0]}</span>
      {text.slice(1)}
    </>
  );
}
