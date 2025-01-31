import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const HeaderCard = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
      <div className="relative h-[300px]">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop')",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-mlb-navy/90 to-mlb-navy/70" />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-8 lg:px-12">
          {/* Left side - AI Assistant Icon */}
          <div className="hidden lg:flex items-center justify-center w-1/4">
            <div className="w-32 h-32 rounded-full bg-mlb-red/20 backdrop-blur-sm flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-16 h-16 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
          </div>
          
          {/* Right side - Text and Button */}
          <div className="flex-1 lg:w-3/4 text-white lg:pl-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Step into the Commentary Box with AI
            </h2>
            <p className="text-lg lg:text-xl mb-6 text-gray-200 max-w-2xl">
              Get real-time insights and answers about every play as it happens. Our AI assistant breaks down the game, pitch by pitch, helping you understand the strategy behind America's favorite pastime.
            </p>
            <Button 
              size="lg"
              className="bg-mlb-red hover:bg-mlb-red/90 text-white font-semibold"
              onClick={() => navigate("/game/1")}
            >
              Start Analyzing Games
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderCard