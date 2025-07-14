const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getDashboardData(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/api/dashboard/data?${queryString}`);
    }

    async getFilterOptions() {
        return this.request('/api/dashboard/filter-options');
    }
}

export default new ApiService();