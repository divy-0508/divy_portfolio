import { useState, useRef } from "react";
import { predictNextWord } from "../components/WordPredictor";

export function useWordPredict() {
  const [suggestion, setSuggestion] = useState("");
  const debounceRef = useRef(null);

  function onType(value, setter) {
    setter(value);
    setSuggestion("");
    clearTimeout(debounceRef.current);
    if (!value.trim()) return;
    debounceRef.current = setTimeout(async () => {
      const results = await predictNextWord(value);
      if (results[0]) setSuggestion(results[0].word);
    }, 600);
  }

  function acceptSuggestion(currentValue, setter) {
    if (!suggestion) return false;
    setter(currentValue.trimEnd() + " " + suggestion);
    setSuggestion("");
    return true;
  }

  return { suggestion, onType, acceptSuggestion };
}