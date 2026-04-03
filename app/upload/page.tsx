export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 flex items-center justify-center p-6">
      
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-xl border border-gray-100">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Upload File
        </h1>

        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-teal-300 rounded-xl h-56 cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all duration-300">
          
          <svg
            className="w-14 h-14 text-teal-400 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>

          <p className="text-gray-600 font-medium">
            Drag & Drop your file here
          </p>

          <p className="text-sm text-gray-400">
            or click to browse
          </p>

          <input type="file" className="hidden" />
        </label>

        {/* Upload Button */}
        <button className="mt-6 w-full bg-teal-500 text-white py-3 rounded-xl font-semibold tracking-wide hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg">
          Upload File
        </button>

      </div>
    </div>
  );
}