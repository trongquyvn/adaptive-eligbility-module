/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1 className="text-2xl font-semibold text-gray-800">REMAP-CAP</h1>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          + Create New Patient
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-gray-700">James Terry</span>
        </div>
      </div>
    </header>
  );
}
