import { useState } from "react";
import { FiMessageCircle, FiSend, FiTrash2 } from "react-icons/fi";
import PageTitle from "../components/PageTitle";

export default function BloodHelper() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm Blood Helper, your donation assistant. I can help you with information about blood donation, eligibility, health benefits, and answer any questions you might have. How can I assist you today?",
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
    ambulance:
      "🚑 *BloodBridge Ambulance Desk*\n\n• GPS-based nearest ambulance detection\n• Division-wise verified contact numbers under Emergency Services\n• Tap the 'One-click SOS' button to dispatch the closest crew\n• Requests marked “Needs Ambulance” highlight this to donors instantly",
    clinics:
      "🏥 *Division-wise Clinics*\n\n• Dhaka Hemato Care – hotline 09612-558855\n• Chattogram Blood & Cancer Center – hotline 031-778899\n• Khulna Hematology Institute – hotline 041-556677\n\nBrowse the Clinics section on the home page for ratings, facilities, and emergency numbers.",
    rewards:
      "🎖️ *Donor Rewards & Badges*\n\nBronze (1 donation), Silver (3 donations), Gold (5+ donations + downloadable certificate). Each donor profile has a unique QR; hospitals scan it to verify completion and unlock badges automatically.",
    urgency:
      "🔔 *Urgency Prioritization*\n\n🔴 Critical – respond within 3 hours, ambulance auto-alerted\n🟠 Urgent – respond within 24 hours (scheduled surgeries)\n🟢 Flexible – 2–3 days window for planning\n\nFilters on the request page let you focus on the urgency you can cover.",
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
        lowerInput.includes("ambulance") ||
        lowerInput.includes("sos") ||
        lowerInput.includes("emergency vehicle")
      ) {
        response = predefinedResponses.ambulance;
      } else if (
        lowerInput.includes("clinic") ||
        lowerInput.includes("doctor") ||
        lowerInput.includes("hospital")
      ) {
        response = predefinedResponses.clinics;
      } else if (
        lowerInput.includes("reward") ||
        lowerInput.includes("badge") ||
        lowerInput.includes("certificate") ||
        lowerInput.includes("qr")
      ) {
        response = predefinedResponses.rewards;
      } else if (
        lowerInput.includes("urgent") ||
        lowerInput.includes("critical") ||
        lowerInput.includes("flexible")
      ) {
        response = predefinedResponses.urgency;
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
          "I can help you with:\n\n📋 Eligibility requirements\n💪 Health benefits of donating\n🔄 Donation process & aftercare\n🚑 Ambulance/SOS workflow\n🏥 Clinics, doctors & NGOs\n🎖️ Rewards, badges & QR verification\n\nAsk me about any of these topics for detailed guidance!";
      }

      const assistantMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm Blood Helper, your donation assistant. I can help you with information about blood donation, eligibility, health benefits, and answer any questions you might have. How can I assist you today?",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">

      <PageTitle title="Blood Helper" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
            Blood Helper Assistant
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            Bolt-style AI concierge for registration, eligibility, ambulance linking, clinic guidance, reminders, and badges.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Container */}
          <div className="rounded-2xl shadow-2xl border border-gray-700 bg-gray-800/30 backdrop-blur-xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/30">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-gray-200 font-semibold text-sm">
                  Live Assistant
                </span>
              </div>
              <button
                onClick={handleClearChat}
                className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium"
                title="Clear Chat"
              >
                <FiTrash2 /> Clear
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-900/30">
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
                        ? "bg-white text-black shadow-md"
                        : "bg-gray-800/50 border border-gray-700 text-gray-100 backdrop-blur-md shadow-sm"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <FiMessageCircle className="text-white" />
                        <span className="text-xs font-bold text-white">
                          Blood Helper
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
                  <div className="border border-gray-700 rounded-2xl p-4 bg-gray-800/50 backdrop-blur-md flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm font-medium animate-pulse">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 bg-gray-900/50 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about blood donation..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-600 focus:border-gray-400 focus:outline-none bg-gray-800 text-gray-100 placeholder-gray-400 text-sm sm:text-base"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              "How do urgency levels work?",
              "Show ambulance options",
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question);
                }}
                className="border border-gray-700 hover:border-gray-500 rounded-xl p-3 text-sm text-gray-300 hover:text-white bg-gray-800/30 backdrop-blur-md transition-all duration-300 hover:shadow-lg text-left"
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
