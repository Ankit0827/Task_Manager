const InfoCard = ({ label, value, color }) => {
  console.log("value",value)
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">
      {/* Colored indicator dot */}
      <div className={`w-3 h-6 md:w-4 md:h-4 ${color} rounded-md`} />
      {/* Text content */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-base md:text-lg font-semibold text-gray-800">{value}</span>
        <span className="text-sm md:text-[14px] text-gray-500">{label}</span>
      </div>
    </div>
  );
};

export default InfoCard;
