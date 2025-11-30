// frontend/src/pages/ApplicationForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplication, createApplication, updateApplication } from '../services/applicationService';

export default function ApplicationForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!!id);
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
            setLoading(true);
            if (id) {
                await updateApplication(id, formData);
            } else {
                await createApplication(formData);
            }
            navigate('/applications');
        } catch (err) {
            setError(`Failed to ${id ? 'update' : 'create'} application: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {id ? 'Edit Application' : 'Add New Application'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {id ? 'Update the job application details.' : 'Enter the details of the job application.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    id="companyName"
                                    required
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    id="jobTitle"
                                    required
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700">
                                    Applied Date *
                                </label>
                                <input
                                    type="date"
                                    name="appliedDate"
                                    id="appliedDate"
                                    required
                                    value={formData.appliedDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={4}
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Add any additional notes about this application.
                                </p>
                            </div>
                        </div>

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/applications')}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}