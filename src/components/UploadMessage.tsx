export default function UploadMessage({
  message,
}: {
  message: string;
}) {
  switch (message) {
    case 'upload error':
      return (
        <div className="absolute -bottom-20 left-0 right-0 bg-[#FF0000] text-[#FFFFFF] text-center py-2">
          <p>Upload failed. Please try again.</p>
        </div>
      );
    case 'upload success':
      return (
        <div className="absolute -bottom-20 left-0 right-0 bg-[#00FF00] text-[#FFFFFF] text-center py-2">
          <p>Upload successful!</p>
        </div>
      );
    default:
      return null;
  }
}
