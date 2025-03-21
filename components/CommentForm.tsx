import { useFormContext } from "react-hook-form";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSession } from "next-auth/react"

export const CommentForm = ({ disabled = false }: { disabled?: boolean }) => {
  const { register } = useFormContext();
  const { data: session } = useSession()
  return (
    <div className="sm:col-span-6">
      <div className="flex justify-between">
        <label
          htmlFor="about"
          className="block text-sm font-medium text-gray-700"
        >
          Reasoning
        </label>
        <span className="text-sm text-gray-500 select-none" id="reasoning-optional">
          Optional
        </span>
      </div>
      <div className="mt-1">
        <ReactTextareaAutosize
          id="about"
          minRows={3}
          disabled={disabled}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md disabled:opacity-25
          disabled:bg-gray-100

          "
          defaultValue={""}
          placeholder={`I predicted X% because...`}
          {...register("comment")}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500"></p>
    </div>
  );
};
