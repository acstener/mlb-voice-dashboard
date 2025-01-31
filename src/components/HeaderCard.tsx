import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const HeaderCard = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full mb-8 overflow-hidden rounded-2xl shadow-xl">
      <div className="relative h-[400px]">
        {/* Background with sophisticated gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop')",
          }}
        >
          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-mlb-navy/95 via-mlb-navy/85 to-mlb-navy/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-mlb-navy/50 via-transparent to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-6 md:px-12 lg:px-16">
          {/* Left side - Enhanced AI Assistant Icon */}
          <div className="hidden lg:flex items-center justify-center w-1/4">
            <div className="relative">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-mlb-red/20 rounded-full blur-2xl transform scale-110" />
              
              {/* Main circle with glass effect */}
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl">
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-full bg-mlb-red/5 animate-pulse" />
                
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-20 h-20 text-white/90"
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
          </div>
          
          {/* Right side - Enhanced Text and Button */}
          <div className="flex-1 lg:w-3/4 text-white lg:pl-12">
            <div className="space-y-6">
              {/* Eyebrow text */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-[1px] bg-mlb-red/80" />
                <span className="text-sm font-medium uppercase tracking-wider text-mlb-red/80">AI-Powered Analysis</span>
              </div>
              
              {/* Main heading with gradient text */}
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Step into the Commentary Box with AI
              </h2>
              
              {/* Description with improved readability */}
              <p className="text-lg lg:text-xl text-gray-300/90 max-w-2xl font-medium leading-relaxed">
                Get real-time insights and answers about every play as it happens. Our AI assistant breaks down the game, pitch by pitch, helping you understand the strategy behind America's favorite pastime.
              </p>
              
              {/* Enhanced CTA button */}
              <div className="pt-4">
                <Button 
                  size="lg"
                  className="bg-mlb-red hover:bg-mlb-red/90 text-white font-semibold px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={() => navigate("/game/1")}
                >
                  Start Analyzing Games
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderCard