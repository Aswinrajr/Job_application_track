// frontend/src/services/applicationService.js
const API_URL = 'https://job-application-track-slrb.onrender.com/api/applications';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { 'Authorization': `Bearer ${user.token}` };
    }
    return {};
};

export const getApplications = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch applications');
    }
    return data;
};

export const getApplication = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch application');
    }
    return data;
};

export const createApplication = async (applicationData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(applicationData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create application');
    }
    return data;
};

export const updateApplication = async (id, applicationData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(applicationData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update application');
    }
    return data;
};

export const deleteApplication = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete application');
    }
};