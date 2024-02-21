import React from "react";

const ChatMessage = ({ text, sender, onFollowUpClick }) => {
    const renderFormattedText = (text) => {
        if (!text) return null;

        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/\n/g, "<br>");
        
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
    };

    var followUpQuestions = [];
    if (text.includes("Want to know more?")) {
        const followUpQuestions1 = text.match(/\* (.*?)\?/g);
        const followUpQuestions2 = text.match(/\d+\.\s(.*?)\?/g);
        
        if (followUpQuestions1) {
            followUpQuestions.push(...followUpQuestions1.map(question => question.slice(2, -1)));
        }
        
        if (followUpQuestions2) {
            followUpQuestions.push(...followUpQuestions2.map(question => question.slice(3, -1)));
        }
    }

    return (
        <div className={`message ${sender}`}>
            {renderFormattedText(text)}
            {followUpQuestions && followUpQuestions.length > 0 && (
                <div className="follow-up-buttons">
                    {followUpQuestions.map((question, index) => (
                        <div key={index}>
                            <button onClick={() => onFollowUpClick(question)}>Try</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatMessage;