import { LuPaperclip } from "react-icons/lu";
import AvatarGroup from "../AvatarGroup";
import Progress from "../Progress";
import moment from "moment";

const TaskCard = ({
    title,
    description,
    priority,
    status,
    progress,
    createdAt,
    dueDate,
    assignedTo,
    attachments,
    completedTodoCount,
    todoChecklist,
    onClick,
}) => {
    const getStatusTagColor = () => {
        switch (status) {
            case "In progress":
                return "text-cyan-600 bg-cyan-100 border border-cyan-200";
            case "Completed":
                return "text-lime-600 bg-lime-100 border border-lime-200";
            default:
                return "text-violet-600 bg-violet-100 border border-violet-200";
        }
    };

    const getPriorityTagColor = () => {
        switch (priority) {
            case "Low":
                return "text-emerald-600 bg-emerald-100 border border-emerald-200";
            case "Medium":
                return "text-amber-600 bg-amber-100 border border-amber-200";
            default:
                return "text-rose-600 bg-rose-100 border border-rose-200";
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer space-y-4"
        >
            {/* Status and Priority Tags */}
            <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor()}`}>
                    {status}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityTagColor()}`}>
                    {priority} Priority
                </span>
            </div>

            {/* Title + Description */}
            <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>

            {/* Checklist Progress */}
            <div className="text-sm text-gray-600">
                Task Done:{" "}
                <span className="font-medium text-gray-800">
                    {completedTodoCount}/{todoChecklist.length || 0}
                </span>
            </div>
            <Progress progress={progress} status={status} />

            {/* Dates + Assignees + Attachments */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <div className="space-y-1">
                    <div>
                        <span className="font-medium text-gray-600">Start:</span>{" "}
                        {moment(createdAt).format("DD MMM YYYY")}
                    </div>
                    <div>
                        <span className="font-medium text-gray-600">Due:</span>{" "}
                        {moment(dueDate).format("DD MMM YYYY")}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <AvatarGroup avatars={assignedTo || []} />
                    {attachments > 0 && (
                        <div className="flex items-center gap-1 text-gray-600">
                            <LuPaperclip className="text-base" />
                            <span className="text-sm">{attachments}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
