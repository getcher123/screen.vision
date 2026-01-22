import { useState } from "react";
import { ThumbUpIcon, ThumbDownIcon } from "../icons";
import { Button } from "../ui/button";

type FeedbackType = "positive" | "negative" | null;

interface MinimalTaskScreenProps {
  goal?: string;
  onFeedbackSubmit?: (type: "positive" | "negative", text: string) => void;
}

export const MinimalTaskScreen = ({
  goal,
  onFeedbackSubmit,
}: MinimalTaskScreenProps) => {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackClick = (type: FeedbackType) => {
    if (selectedFeedback === type) {
      setSelectedFeedback(null);
      setFeedbackText("");
    } else {
      setSelectedFeedback(type);
      setFeedbackText("");
      setFeedbackSubmitted(false);
    }
  };

  const handleSubmitFeedback = () => {
    if (selectedFeedback && feedbackText.trim()) {
      onFeedbackSubmit?.(selectedFeedback, feedbackText.trim());
      setFeedbackSubmitted(true);
      setFeedbackText("");
      setTimeout(() => {
        setSelectedFeedback(null);
        setFeedbackSubmitted(false);
      }, 2000);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col h-[100dvh]">
      <div className="flex flex-col w-full h-full">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="max-w-[600px] mx-auto w-full px-4">
            {goal && (
              <div className="mb-2 text-center">
                <p
                  className="text-md text-gray-600 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "100ms" }}
                >
                  Следуйте шагам в правом нижнем углу экрана.
                </p>
              </div>
            )}

            <div
              className="flex flex-col items-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFeedbackClick("positive")}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    selectedFeedback === "positive"
                      ? "bg-green-100 text-green-600 scale-110"
                      : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="Палец вверх"
                >
                  <ThumbUpIcon size={24} />
                </button>
                <button
                  onClick={() => handleFeedbackClick("negative")}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    selectedFeedback === "negative"
                      ? "bg-red-100 text-red-600 scale-110"
                      : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="Палец вниз"
                >
                  <ThumbDownIcon size={24} />
                </button>
              </div>

              <div
                className={`w-full overflow-hidden transition-all duration-300 ease-out ${
                  selectedFeedback
                    ? "max-h-[200px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {feedbackSubmitted ? (
                  <div className="text-center py-4 text-green-600 font-medium animate-fade-in-up">
                    Спасибо за отзыв!
                  </div>
                ) : (
                  <div className="pt-4">
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder={
                        selectedFeedback === "positive"
                          ? "Что понравилось?"
                          : "Что можно улучшить?"
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-0 text-sm"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleSubmitFeedback}
                        disabled={!feedbackText.trim()}
                      >
                        Отправить отзыв
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
