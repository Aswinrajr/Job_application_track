import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplication, createApplication, updateApplication } from '../services/applicationService';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ApplicationForm({ onCancel, isModal = false, id: propId }) {
    const { id: paramId } = useParams();
    const id = propId || paramId;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        if (id) {
            const fetchApplication = async () => {
                try {
                    setLoading(true);
                    const data = await getApplication(id);
                    setFormData({
                        companyName: data.companyName,
                        jobTitle: data.jobTitle,
                        status: data.status,
                        appliedDate: new Date(data.appliedDate).toISOString().split('T')[0],
                        notes: data.notes || '',
                    });
                } catch (err) {
                    setError('Failed to fetch application');
                    toast.error('Could not load application details');
                } finally {
                    setLoading(false);
                }
            };
            fetchApplication();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (id) {
                await updateApplication(id, formData);
                toast.success('Application updated successfully');
            } else {
                await createApplication(formData);
                toast.success('Application created successfully');
            }
            
            if (onCancel) {
                onCancel();
                // Optionally refresh listing
                window.location.reload(); // Simple way to refresh for now
            } else {
                navigate('/dashboard/applications');
            }
        } catch (err) {
            setError(`Failed: ${err.message}`);
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading && id) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-10 bg-white/5 rounded-lg" />
                <div className="h-10 bg-white/5 rounded-lg" />
                <div className="h-32 bg-white/5 rounded-lg" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Company Name"
                    name="companyName"
                    placeholder="e.g. Google, Stripe"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                />

                <Input
                    label="Job Title"
                    name="jobTitle"
                    placeholder="e.g. Senior Software Engineer"
                    required
                    value={formData.jobTitle}
                    onChange={handleChange}
                />

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-app-muted ml-0.5">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-app-dark border border-app-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-accent/60 focus:ring-1 focus:ring-accent/20 outline-none transition-all"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <Input
                    label="Applied Date"
                    type="date"
                    name="appliedDate"
                    required
                    value={formData.appliedDate}
                    onChange={handleChange}
                />

                <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-medium text-app-muted ml-0.5">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        rows={4}
                        placeholder="Key requirements, referral info, or next steps..."
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full bg-app-dark border border-app-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-app-muted/60 focus:border-accent/60 focus:ring-1 focus:ring-accent/20 outline-none transition-all resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => onCancel ? onCancel() : navigate('/dashboard/applications')}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={saving}
                    className="min-w-[120px]"
                >
                    {saving ? 'Saving...' : (id ? 'Update' : 'Create')}
                </Button>
            </div>
        </form>
    );
}
