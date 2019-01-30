import decode from 'jwt-decode';
import "isomorphic-fetch";

const jwt_key = 'jwt';
const domain = 'https://opnsf17dt0.execute-api.us-east-1.amazonaws.com/prod';

// All API calls will return a rejected promise on non-200 response codes
// The rejected promise contains a simple error message

export async function authenticate(email, password) {
    const resp = await fetch(`${domain}/v1/auth`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': `application/json`
        },
        body: JSON.stringify({
            email,
            password,
        })
    });
    const handled = await handleResponse(resp);
    return handled;
}

export async function createUser(email, password) {
    const resp = await fetch(`${domain}/v1/users`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': `application/json`
        },
        body: JSON.stringify({
            email,
            password,
        })
    });
    const handled = await handleResponse(resp);
    return handled;
}

export async function deleteUser() {
    if (!isLoggedIn()) {
        return Promise.reject('Not logged in');
    }
    const jwt = getToken();

    const resp = await fetch(`${domain}/v1/users`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
    const handled = await handleResponse(resp);
    return handled;
}

export async function updateUserPassword(oldPassword, newPassword) {
    if (!isLoggedIn()) {
        return Promise.reject('Not logged in');
    }
    const jwt = getToken();

    const resp = await fetch(`${domain}/v1/users/passwords`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
        })
    });
    const handled = await handleResponse(resp);
    return handled;
}

export async function upsertVault(vault) {
    if (!isLoggedIn()) {
        return Promise.reject('Not logged in');
    }
    const jwt = getToken();

    const resp = await fetch(`${domain}/v1/vaults`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(vault)
    });
    const handled = await handleResponse(resp);
    return handled;
}

export async function getVault(vault) {
    if (!isLoggedIn()) {
        return Promise.reject('Not logged in');
    }
    const jwt = getToken();

    const resp = await fetch(`${domain}/v1/vaults`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
    const handled = await handleResponse(resp);
    return handled;
}

export async function verifyEmail(code) {
    if (!isLoggedIn()) {
        return Promise.reject('Not logged in');
    }
    const jwt = getToken();

    const resp = await fetch(`${domain}/v1/users/verify`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
            code
        })
    });
    const handled = await handleResponse(resp);
    return handled;
}

export function isLoggedIn() {
    const token = getToken();
    return isTokenValid(token);
}

export function setToken(token) {
    localStorage.setItem(jwt_key, token);
}

export function getToken() {
    return localStorage.getItem(jwt_key);
}

export function deleteToken() {
    localStorage.removeItem(jwt_key);
}

function isTokenValid(token) {
    try {
        const decoded = decode(token);
        return decoded.exp > Date.now() / 1000 && decoded.email_verified;
    } catch (err) {
        return false;
    }
}

async function handleResponse(response) {
    const json = await response.json();
    if (typeof json.message !== "undefined") {
        return Promise.reject(json.message);
    } else if (!response.ok) {
        return Promise.reject('Unknown error occured');
    }
    return json;
}
