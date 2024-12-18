interface CheckboxProps {
  label: string;
}

export const Checkbox = ({ label }: CheckboxProps) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="checkbox checkbox-sm checkbox-primary"
      />
      <span>{label}</span>
    </label>
  );
};
