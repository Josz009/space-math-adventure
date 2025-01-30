import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Gamepad2, Brain, ChartLine } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto"
      >
        <motion.div 
          variants={item}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-7xl font-bold mb-4 text-white tracking-tight"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Math Adventure
          </motion.h1>
          <p className="text-2xl text-white/90">
            Learn math through exciting games and challenges!
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          <motion.div variants={item}>
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
              <CardContent className="p-8">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500" />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <Gamepad2 className="w-12 h-12 mb-6 text-purple-500" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Space Adventure
                </h2>
                <p className="mb-8 text-gray-600 text-lg">
                  Journey through space while mastering math! Each correct answer powers your spaceship further.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                  onClick={() => navigate("/adventure")}
                >
                  Start Adventure
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
              <CardContent className="p-8">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500" />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <Brain className="w-12 h-12 mb-6 text-indigo-500" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Math Puzzles
                </h2>
                <p className="mb-8 text-gray-600 text-lg">
                  Challenge yourself with fun puzzles! Unlock achievements and track your progress.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6"
                  onClick={() => navigate("/puzzle")}
                >
                  Start Puzzles
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={item}
          className="text-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white gap-2 group"
            onClick={() => navigate("/parent")}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
              className="group-hover:rotate-180 transition-transform duration-500"
            >
              <ChartLine className="w-5 h-5" />
            </motion.div>
            Parent Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}