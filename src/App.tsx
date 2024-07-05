import EmojiPickerExample from "./components/emoji-picker-example";

const App: React.FC = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="border min-h-60 p-4">
        <EmojiPickerExample />
      </div>
    </div>
  );
};

export default App;
