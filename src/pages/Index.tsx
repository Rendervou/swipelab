import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Brain, Heart, ArrowRight, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Heart,
      title: 'Swipe to Rate',
      description: 'Tinder-style swiping makes giving feedback fun and fast. Right for love, left to skip.',
      color: 'coral',
    },
    {
      icon: Brain,
      title: 'AI Mentor',
      description: 'Get instant AI-powered feedback on your designs with strengths, weaknesses, and scores.',
      color: 'lavender',
    },
    {
      icon: Zap,
      title: 'Quick Feedback',
      description: 'Upload your work and get real opinions from fellow designers in minutes.',
      color: 'mint',
    },
  ];

  const categories = ['UI/UX', 'Poster', 'Illustration'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-lavender/20 blur-3xl" />
        
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-gold" />
                <span>Dribbble meets Tinder meets AI</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl font-bold tracking-tight md:text-7xl"
            >
              Design feedback{' '}
              <span className="text-gradient-primary">that slaps</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              Upload your designs, swipe through others, and get AI-powered insights. 
              Join the community where creative feedback is actually fun.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              {user ? (
                <Link to="/feed">
                  <Button variant="gradient" size="xl">
                    Start Swiping
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="gradient" size="xl">
                      Get Started Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="xl">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-sm text-muted-foreground">Popular categories:</span>
              {categories.map((cat, i) => (
                <span
                  key={cat}
                  className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium"
                >
                  {cat}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Why designers love SwipeLab
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Fast, fun, and actually useful feedback
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-3xl bg-card p-8 shadow-card transition-all hover:shadow-lg"
              >
                <div className={`mb-6 inline-flex rounded-2xl bg-${feature.color}/10 p-4`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-20 text-center"
          >
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
            
            <div className="relative">
              <Star className="mx-auto h-12 w-12 text-primary-foreground/80 mb-6" />
              <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">
                Ready to level up your designs?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Join thousands of designers getting real feedback every day.
              </p>
              <div className="mt-8">
                <Link to={user ? "/feed" : "/register"}>
                  <Button 
                    size="xl" 
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    {user ? "Start Exploring" : "Create Free Account"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">SwipeLab</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SwipeLab. Made with ❤️ for designers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
