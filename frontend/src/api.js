const API = 'http://my-api';

async function request(url, options = {}) {
    try {
        const response = await fetch(API + url, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        });

        const text = await response.text();
        let cleanText = text;
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');

        if (jsonStart !== -1 && jsonEnd !== -1) {
            cleanText = text.substring(jsonStart, jsonEnd + 1);
        }

        let data;
        try {
            data = JSON.parse(cleanText);
        } catch (e) {
            data = { error: 'Invalid server response' };
        }

        if (!response.ok) {
            const errorMessage = data.error || data.message || `HTTP ${response.status}`;
            if (response.status === 401) {
                window.dispatchEvent(new CustomEvent('unauthorized'));
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(errorMessage);
        }

        if (data.success === false) {
            throw new Error(data.message || data.error || 'Operation failed');
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Network error. Please check your connection.');
        }
        throw error;
    }
}

export const api = {
    register(data) { return request('/auth/register.php', { method: 'POST', body: JSON.stringify(data) }); },
    login(data) { return request('/auth/login.php', { method: 'POST', body: JSON.stringify(data) }); },
    logout() { return request('/auth/logout.php', { method: 'POST' }); },
    me() { return request('/auth/me.php'); },
    updateProfile(data) { return request('/auth/update-profile.php', { method: 'PUT', body: JSON.stringify(data) }); },
    changePassword(data) { return request('/auth/change-password.php', { method: 'PUT', body: JSON.stringify(data) }); },

    getPosts() { return request('/posts/getAll.php'); },
    getPost(id) { return request(`/posts/getOne.php?id=${id}`); },
    createPost(data) { return request('/posts/create.php', { method: 'POST', body: JSON.stringify(data) }); },
    updatePost(data) { return request('/posts/update.php', { method: 'PUT', body: JSON.stringify(data) }); },
    deletePost(id) { return request('/posts/delete.php', { method: 'DELETE', body: JSON.stringify({ id }) }); },

    getMenu() { return request('/posts/getMenu.php'); },
    createMenuItem(data) { return request('/posts/manageMenu.php', { method: 'POST', body: JSON.stringify(data) }); },
    updateMenuItem(data) { return request('/posts/manageMenu.php', { method: 'PUT', body: JSON.stringify(data) }); },
    deleteMenuItem(id) { return request('/posts/manageMenu.php', { method: 'DELETE', body: JSON.stringify({ id }) }); },
    reorderMenu(items) { return request('/posts/reorderMenu.php', { method: 'PUT', body: JSON.stringify({ items }) }); },

    getUsers() { return request('/admin/users.php'); },
    blockUser(userId, isBlocked) { return request('/admin/block-user.php', { method: 'PUT', body: JSON.stringify({ user_id: userId, is_blocked: isBlocked }) }); },
    changeRole(userId, role) { return request('/admin/change-role.php', { method: 'PUT', body: JSON.stringify({ user_id: userId, role }) }); },

    getLanguages() { return request('/admin/languages.php'); },
    getPublicLanguages() { return request('/languages/list.php'); },
    getActiveLanguage() { return request('/languages/active.php'); },
    createLanguage(data) { return request('/admin/create-language.php', { method: 'POST', body: JSON.stringify(data) }); },
    updateLanguage(data) { return request('/admin/update-language.php', { method: 'PUT', body: JSON.stringify(data) }); },
    deleteLanguage(id) { return request('/admin/delete-language.php', { method: 'DELETE', body: JSON.stringify({ id }) }); },
    setActiveLanguage(id) { return request('/admin/set-active-language.php', { method: 'PUT', body: JSON.stringify({ id }) }); }
};

window.addEventListener('unauthorized', () => {
    localStorage.removeItem('user');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
    }
});