import { useFormContext } from "react-hook-form";
import ReactTextareaAutosize from "react-textarea-autosize";

export const CommentForm = () => {
  const { register } = useFormContext();
  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="about"
        className="block text-sm font-medium text-gray-700"
      >
        Reasoning
      </label>
      <div className="mt-1">
        <ReactTextareaAutosize
          id="about"
          minRows={3}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
          defaultValue={""}
          placeholder="I predicted X% because..."
          {...register("comment")}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500"></p>
    </div>
  );
};
