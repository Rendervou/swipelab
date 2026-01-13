import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.name);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome to SwipeLab!');
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-hero relative overflow-hidden">
        <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-mint/30 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-electric-blue/30 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative text-center p-12"
        >
          <div className="mb-8 mx-auto h-24 w-24 rounded-3xl bg-gradient-secondary flex items-center justify-center shadow-lg animate-float">
            <Sparkles className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">
            Your Design Journey Starts Here
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Share your work, discover inspiration, and grow with AI-powered feedback
          </p>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">SwipeLab</span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Start getting feedback on your designs</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  {...register('name')}
                  id="name"
                  placeholder="Your name"
                  className="pl-10 h-12"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  className="pl-10 h-12"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
