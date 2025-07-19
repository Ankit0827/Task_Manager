
const Modal = ({ children, isOpen, onClose, title }) => {

    if (!isOpen) return;
    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto">
  <div className="relative p-4 w-full max-w-2xl">
    <div className="bg-white rounded-lg shadow-md">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          type="button"
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-4 space-y-4">{children}</div>
    </div>
  </div>
</div>


    );
}

export default Modal