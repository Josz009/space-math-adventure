import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-blue-600 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center text-white"
      >
        <h1 className="text-6xl font-bold mb-8">Math Adventure</h1>
        <p className="text-xl mb-12">Choose your learning journey!</p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="group hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <img
                src="https://images.unsplash.com/photo-1500995617113-cf789362a3e1"
                alt="Space Adventure"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
              <h2 className="text-2xl font-bold mb-4 text-purple-700">Space Adventure</h2>
              <p className="mb-6 text-gray-600">
                Solve math problems while exploring the galaxy! Perfect for visual learners.
              </p>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/adventure")}
              >
                Start Adventure
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <img
                src="https://images.unsplash.com/photo-1640955011254-39734e60b16f"
                alt="Math Puzzles"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
              <h2 className="text-2xl font-bold mb-4 text-purple-700">Math Puzzles</h2>
              <p className="mb-6 text-gray-600">
                Challenge yourself with fun math puzzles and earn rewards!
              </p>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/puzzle")}
              >
                Start Puzzles
              </Button>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="outline"
          className="mt-8 bg-white"
          onClick={() => navigate("/parent")}
        >
          Parent Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
