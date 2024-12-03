interface InputComponentProps {
  type: string;
  inputLable: string;
  auth?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Changed to match prop name
}

function Inputcomponent({
  type,
  inputLable,
  auth,
  onChange,
  value,
  onKeyDown, // Ensure consistency in prop naming
}: InputComponentProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={type}
          className="block text-sm font-medium text-gray-900"
        >
          {inputLable}
        </label>
        {type === "password" && auth === "signin" && (
          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
        )}
      </div>
      <div className="mt-2">
        <input
          id={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown} // Ensure this matches the prop name
          name={type}
          type={type}
          required
          autoComplete="current-password"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm"
        />
      </div>
    </div>
  );
}

export default Inputcomponent;
