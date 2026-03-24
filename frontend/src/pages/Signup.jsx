import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import { IoBriefcaseOutline, IoArrowForward } from 'react-icons/io5';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'react-hot-toast';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        try {
            setLoading(true);
            await signup(formData.email, formData.password, formData.name);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create an account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-app-dark relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-8">
                   <div className="inline-flex w-16 h-16 rounded-2xl bg-accent items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-6">
                      <IoBriefcaseOutline size={32} />
                   </div>
                   <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h2>
                   <p className="text-app-muted">Start tracking your career journey with premium tools.</p>
                </div>

                <Card className="p-8 backdrop-blur-xl bg-app-card/60">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength="6"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength="6"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 mt-2" 
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                            {!loading && <IoArrowForward className="ml-2" />}
                        </Button>
                    </form>

                    <div className="relative my-8 text-center uppercase tracking-widest text-[10px] text-app-muted font-bold">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <span className="relative px-4 bg-app-card/90">Or sign up with</span>
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
                        Already have an account?{' '}
                        <Link to="/login" className="text-white hover:text-accent font-semibold transition-colors underline underline-offset-4 decoration-white/20">
                            Sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
