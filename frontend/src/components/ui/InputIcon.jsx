export default function InputIcon({ children }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
      {children}
    </div>
  );
}
