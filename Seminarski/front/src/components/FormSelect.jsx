const FormSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-gray-700 uppercase ml-1">
        {label}
      </label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none text-gray-900"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
