import React, { useEffect, useRef, useState } from 'react'

const sidebarItems = [
  { label: "New Chat" },
  { label: "History" },
  { label: "Settings" }
];

const App = () => {

  const [messages, setMessage] = useState([
    { from: "bot ", text: "Hi ! How can I help you today?" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessage((prev) => [...prev, { from: "user", text: input }]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessage((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (error) {
      setMessage((prev) => [...prev, { from: "bot", text: "Something went wrong!" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#23272f] min-h-screen flex flex-row items-stretch justify-center">

      {/* sidebar */}
      <div className='w-[180px] bg-[#18181b] flex flex-col items-start pt-8 gap-6 shadow-[2px_0_8px_rgba(0,0,0,0.12)]'>
        {sidebarItems.map((item, index) => (
          <div key={index} className="px-8 py-3 text-white cursor-pointer text-[1.1rem] font-medium w-full text-left rounded-lg transition-colors hover:bg-[#23272f]">
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col items-center justify-center'>
        <div className='w-full max-w-[1000px] bg-[#18181b] rounded-[20px] shadow-[2px_0_8px_rgba(0,0,0,0.12)] flex flex-col h-[90vh]'>
          <div className='pt-6 text-center text-white font-bold text-[1.6rem] '>
            ChatGPT💬
          </div>

          <div className='flex-1 overflow-auto p-6 flex flex-col gap-4'>
            {messages.map((msg, idx) => (
              <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`} key={idx}>
                <div className={`px-4 py-3 rounded-[10px] max-w-[70%]  text-base ${msg.from === "user" ? "bg-[#00ff90] text-[#23272f]" : "bg-[#343541] text-white"}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-white text-base">Thinking....</div>
            )}
            <div ref={chatEndRef}/>
            </div>

              
            

          <div className='p-4 border-t border-[#282828] flex gap-3 bg-[#18181b] rounded-[10px]'>
            <input type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) =>e.key == "Enter" && sendMessage()}
            placeholder='Type a message...' className='flex-1 bg-[#23272f] text-white border-none rounded-lg px-3 py-3 text-base outline-none' />
            <button onClick={sendMessage} className='bg-[#00ff90] text-[#23272f] border-none rounded-lg px-8 font-bold text-base cursor-pointer'>Send</button>
            <button 
           onClick={()=>
            setMessage([{from:"bot", text:"Hi ! Hoe Can I Help You Today?"}])
           } className='bg-[#343541] text-white border-none rounded-lg px-8 font-bold text-base cursor-pointer'>Clear</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
