export function getToken() {
  const { access_token } = history.state;

  if (!access_token) {
    throw new Error('Access Token not defined!');
  }

  return access_token;
}
