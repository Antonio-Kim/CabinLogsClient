type LoginProps = {
  email: string;
  password: string;
};

type SignupProps = {
  fullName: string;
  email: string;
  password: string;
};

type SignupResponse = {
  message: string;
};

type UserInfo = {
  id: string;
  fullName: string;
  email: string;
  userName: string;
};

type UpdateCurrentUserProps = {
  password?: string;
  fullName?: string;
};

function getToken(): string | null {
  return localStorage.getItem('jwtToken'); // Adjust as needed based on your token storage
}

function getUserId(): string | null {
  const userString = localStorage.getItem('user');
  if (!userString) {
    return null;
  }

  try {
    const user = JSON.parse(userString);
    return user.id || null;
  } catch (e) {
    console.error('Error parsing user data from local Storage:', e);
    return null;
  }
}

export async function login({ email, password }: LoginProps): Promise<void> {
  try {
    const response = await fetch(`http://localhost:5000/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('jwtToken', token);
      const userSession = await userInfo();
      localStorage.setItem('user', JSON.stringify(userSession));
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
  } catch (e) {
    console.error(`Error occurred: ${e}`);
    throw e;
  }
}

export async function signup({ fullName, email, password }: SignupProps): Promise<SignupResponse> {
  try {
    const response = await fetch(`http://localhost:5000/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password }),
    });
    if (response.ok) {
      return { message: 'Sign-up is complete' };
    } else if (response.status === 400) {
      return { message: 'Invalid data provided' };
    } else if (response.status === 500) {
      return { message: 'Server error, please try again later' };
    } else {
      return { message: 'Failed to sign-up' };
    }
  } catch (e) {
    throw new Error(`Error occurred while signing up: ${e}`);
  }
}

export async function userInfo(): Promise<UserInfo> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No JWT found.');
    }
    const response = await fetch(`http://localhost:5000/account/info`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Could not retrieve the account.');
    }
    const user: UserInfo = await response.json();
    return user;
  } catch (e) {
    throw new Error(`Error occurred while fetching user: ${e}`);
  }
}

export async function updateCurrentUser({
  password,
  fullName,
}: UpdateCurrentUserProps): Promise<UserInfo> {
  try {
    const token = getToken();
    const userId = getUserId();
    if (!token) {
      throw new Error('No JWT found.');
    }
    if (!userId) {
      throw new Error('No User found.');
    }
    const response = await fetch(`http://localhost:5000/account/update/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        fullName,
      }),
    });
    if (!response.ok) {
      throw new Error('could not update account.');
    }
    const updatedUser: UserInfo = await response.json();
    return updatedUser;
  } catch (e) {
    throw new Error(`Error occurred while updating user: ${e}`);
  }
}
