export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button className="rounded border-black border-2 p-1 focus:dim" {...props}>
      {props.children}
    </button>
  );
}
