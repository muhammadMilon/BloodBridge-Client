import React, { useState } from "react";
import PageTitle from "../components/PageTitle";
import { FiSend, FiMessageCircle } from "react-icons/fi";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Blood Donation AI Assistant. I can help you with information about blood donation, eligibility, health benefits, and answer any questions you might have. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedResponses = {
    eligibility:
      "To be eligible to donate blood, you should:\n\n✓ Be 18-65 years old\n✓ Weigh at least 50 kg\n✓ Be in good health\n✓ Have normal temperature and blood pressure\n✓ Not have donated blood in the last 3 months\n✓ Not have any infectious diseases\n✓ Not be pregnant or breastfeeding",

    benefits:
      "Blood donation has several health benefits:\n\n🩸 Reduces iron overload\n❤️ Improves cardiovascular health\n🔬 Free health screening\n💪 Stimulates blood cell production\n🧬 May reduce cancer risk\n😊 Psychological satisfaction of saving lives",

    process:
      "The blood donation process:\n\n1️⃣ Registration & health questionnaire (10 min)\n2️⃣ Health screening & blood tests (15 min)\n3️⃣ Blood donation (10-15 min)\n4️⃣ Rest & refreshments (10 min)\n\nTotal time: ~45 minutes",

    preparation:
      "Before donating blood:\n\n💧 Drink plenty of water\n🍽️ Eat a healthy meal\n😴 Get good sleep\n🚭 Avoid smoking for 2 hours before\n🍺 Avoid alcohol for 24 hours before\n💊 Inform about any medications",

    aftercare:
      "After blood donation:\n\n✓ Rest for 10-15 minutes\n✓ Drink extra fluids for 24 hours\n✓ Eat iron-rich foods\n✓ Avoid strenuous exercise for 24 hours\n✓ Keep the bandage on for a few hours\n✓ If you feel dizzy, sit or lie down immediately",
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      let response = "";
      const lowerInput = input.toLowerCase();

      if (
        lowerInput.includes("eligib") ||
        lowerInput.includes("qualify") ||
        lowerInput.includes("can i donate")
      ) {
        response = predefinedResponses.eligibility;
      } else if (
        lowerInput.includes("benefit") ||
        lowerInput.includes("advantage") ||
        lowerInput.includes("why should")
      ) {
        response = predefinedResponses.benefits;
      } else if (
        lowerInput.includes("process") ||
        lowerInput.includes("how to") ||
        lowerInput.includes("procedure")
      ) {
        response = predefinedResponses.process;
      } else if (
        lowerInput.includes("prepar") ||
        lowerInput.includes("before donating")
      ) {
        response = predefinedResponses.preparation;
      } else if (
        lowerInput.includes("after") ||
        lowerInput.includes("care") ||
        lowerInput.includes("recovery")
      ) {
        response = predefinedResponses.aftercare;
      } else if (
        lowerInput.includes("hello") ||
        lowerInput.includes("hi") ||
        lowerInput.includes("hey")
      ) {
        response =
          "Hello! I'm here to help with blood donation information. You can ask me about:\n\n• Eligibility criteria\n• Health benefits\n• Donation process\n• Preparation tips\n• Aftercare advice\n\nWhat would you like to know?";
      } else if (
        lowerInput.includes("blood type") ||
        lowerInput.includes("blood group")
      ) {
        response =
          "There are 8 main blood types:\n\n🅰️ A+ (35.7%)\n🅰️ A- (6.3%)\n🅱️ B+ (8.5%)\n🅱️ B- (1.5%)\n🆎 AB+ (3.4%)\n🆎 AB- (0.6%)\n🅾️ O+ (37.4%)\n🅾️ O- (6.6%)\n\nO- is the universal donor, AB+ is the universal recipient. All blood types are needed!";
      } else if (lowerInput.includes("thank")) {
        response =
          "You're welcome! Remember, every blood donation can save up to 3 lives. Thank you for considering becoming a donor! 🩸❤️";
      } else {
        response =
          "I can help you with:\n\n📋 Eligibility requirements\n💪 Health benefits of donating\n🔄 The donation process\n🎯 Preparation tips\n🏥 Aftercare advice\n🩸 Blood type information\n\nPlease ask me about any of these topics, and I'll provide detailed information!";
      }

      const assistantMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <PageTitle title="AI Assistant" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-3">
            AI Blood Donation Assistant
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Get instant answers about blood donation, eligibility, benefits, and
            more
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Container */}
          <div className="glass rounded-2xl shadow-2xl border border-rose-200 overflow-hidden">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-white/30">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-rose-600 to-red-600 text-white"
                        : "glass border border-rose-200"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <FiMessageCircle className="text-rose-600" />
                        <span className="text-xs font-bold text-rose-600">
                          AI Assistant
                        </span>
                      </div>
                    )}
                    <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="glass border border-rose-200 rounded-2xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-rose-200 bg-white/50 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about blood donation..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Am I eligible to donate?",
              "What are the benefits?",
              "How does the process work?",
              "How to prepare?",
              "What about aftercare?",
              "Tell me about blood types",
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question);
                }}
                className="glass border border-rose-200 hover:border-rose-400 rounded-xl p-3 text-sm text-gray-700 hover:text-rose-600 transition-all duration-300 hover:shadow-lg text-left"
              >
                💬 {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
