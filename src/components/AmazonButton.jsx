// src/components/AmazonButton.jsx
export default function AmazonButton({ text }) {
  return (
    <button className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded">
      {text}
    </button>
  );
}