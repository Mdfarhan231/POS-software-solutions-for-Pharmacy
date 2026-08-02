export default function FormField({ label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
