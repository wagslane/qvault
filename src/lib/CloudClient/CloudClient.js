import decode from 'jwt-decode';
import fetch from 'cross-fetch';

var CLOUD_JWT = null;
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

export async function resendRegistrationEmail(email, password) {
  const resp = await fetch(`${domain}/v1/users`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': `application/json`
    },
    body: JSON.stringify({
      email,
      password,
      resend: true
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

export async function updateUserPasswordEmail(emailJwt, newPassword) {
  const resp = await fetch(`${domain}/v1/users/passwords`, {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify({
      email_jwt: emailJwt,
      new_password: newPassword,
    })
  });
  const handled = await handleResponse(resp);
  return handled;
}

export async function emailPasswordCode(email) {
  const resp = await fetch(`${domain}/v1/users/passwords/email`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      email,
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

export async function getVault() {
  if (!isLoggedIn()) {
    throw 'Not logged in';
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
  if (handled.length < 1){
    throw 'No vaults found on server';
  }
  return handled[0].data;
}

export function isLoggedIn() {
  const token = getToken();
  return isTokenValid(token);
}

export function setToken(token) {
  CLOUD_JWT = token;
}

export function getToken() {
  return CLOUD_JWT;
}

export function deleteToken() {
  CLOUD_JWT = null;
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
