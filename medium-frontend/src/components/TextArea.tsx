interface TextAreaProps {
    label: string;
    placeholder?: string;
    rows?: number;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
  }
  
  function TextAreaComponent({
    label,
    placeholder = "Enter text here...",
    rows = 3,
    onChange,
    value,
  }: TextAreaProps) {
    return (
      <div>
        <label className="block text-sm/6 font-medium text-gray-900">{label}</label>
        <div className="mt-2">
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 resize-none"
          ></textarea>
        </div>
      </div>
    );
  }
  
  export default TextAreaComponent;
  