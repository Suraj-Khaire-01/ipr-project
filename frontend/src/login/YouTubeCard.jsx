export default function YouTubeCard() {
  return (
    <div className="max-w-sm rounded-2xl shadow-lg overflow-hidden bg-white">
      {/* Video Thumbnail with Play Button */}
      <div className="relative">
        <a
          href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.youtube.com/vi/YOUR_VIDEO_ID/hqdefault.jpg"
            alt="YouTube thumbnail"
            className="w-full"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 text-white rounded-full p-3 text-xl">
              ▶
            </div>
          </div>
        </a>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg">Apollo 24|7</h3>
        <p className="text-gray-600 text-sm">
          Uses <a href="#" className="text-blue-600 underline">Vertex AI</a> to provide doctors with key information to give patients the help they need.
        </p>
        <a
          href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm font-medium mt-2 inline-block"
        >
          Watch the video →
        </a>
      </div>
    </div>
  );
}
