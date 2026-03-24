import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoBriefcaseOutline, IoArrowForward, IoMailOutline } from 'react-icons/io5';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            await resetPassword(email);
            toast.success('Check your email for reset instructions', { duration: 5000 });
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            toast.error('Failed to reset password: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-app-dark relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-8">
                   <div className="inline-flex w-16 h-16 rounded-2xl bg-accent items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-6">
                      <IoBriefcaseOutline size={32} />
                   </div>
                   <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Reset Password</h2>
                   <p className="text-app-muted">We'll send a secure link to your inbox.</p>
                </div>

                <Card className="p-8 backdrop-blur-xl bg-app-card/60">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button 
                            type="submit" 
                            className="w-full h-11" 
                            disabled={loading}
                        >
                            {loading ? 'Sending link...' : 'Send reset link'}
                            {!loading && <IoMailOutline className="ml-2" />}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-app-muted">
                        Remembered your password?{' '}
                        <Link to="/login" className="text-white hover:text-accent font-semibold transition-colors underline underline-offset-4 decoration-white/20">
                            Back to sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
