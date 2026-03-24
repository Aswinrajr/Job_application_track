import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import { IoBriefcaseOutline, IoArrowForward } from 'react-icons/io5';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-app-dark relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
           <div className="inline-flex w-16 h-16 rounded-2xl bg-accent items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-6">
              <IoBriefcaseOutline size={32} />
           </div>
           <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
           <p className="text-app-muted">Elevate your career tracking experience.</p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-app-card/60">
          <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-0.5">
                   <label className="text-sm font-medium text-app-muted">Password</label>
                   <Link to="/forgot-password" size="sm" className="text-xs text-accent hover:text-accent-hover font-medium">Forgot password?</Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <IoArrowForward className="ml-2" />}
              </Button>
          </form>

          <div className="relative my-8 text-center uppercase tracking-widest text-[10px] text-app-muted font-bold">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative px-4 bg-app-card/90">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="gap-2">
              <FaGoogle className="text-red-500" /> Google
            </Button>
            <Button variant="secondary" className="gap-2">
              <FaGithub /> GitHub
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-app-muted">
            New to JobTrack?{' '}
            <Link to="/signup" className="text-white hover:text-accent font-semibold transition-colors underline underline-offset-4 decoration-white/20">
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
