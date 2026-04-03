export default function UploadPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Upload File</h1>

      <div className="bg-white shadow-md rounded-xl p-8 max-w-xl">
        
        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-56 cursor-pointer hover:border-blue-500 transition">
          
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>

          <p className="text-gray-500">
            Drag & Drop your file here
          </p>

          <p className="text-sm text-gray-400">
            or click to browse
          </p>

          <input type="file" className="hidden" />
        </label>

        {/* Upload Button */}
        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Upload File
        </button>

      </div>
    </div>
  );
}