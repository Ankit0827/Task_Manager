import moment from "moment";

const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-500 border border-green-200";

      case "Pending":
        return "bg-purple-100 text-purple-500 border border-purple-200";

      case "In progress":
        return "bg-cyan-100 text-cyan-500 border border-cyan-200";

      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  const getPriorityBadgeColor = (status) => {
    switch (status) {
      case "High":
        return "bg-red-100 text-red-500 border border-red-200";

      case "Medium":
        return "bg-orange-100 text-orange-500 border border-orange-200";

      case "Low":
        return "bg-green-100 text-green-500 border border-green-200";

      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };
  return (
    <div className="overflow-x-auto mt-4 rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-[13px] font-medium">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">Created On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tableData?.map((task) => (
            <tr key={task._id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-4 py-2">{task?.title}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeColor(task?.status)}`}>
                  {task?.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadgeColor(task?.priority)}`}>
                  {task?.priority}
                </span>
              </td>
              <td className="px-4 py-2">
                {task?.createdAt ? moment(task.createdAt).format('DD MMM YYYY') : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default TaskListTable;
