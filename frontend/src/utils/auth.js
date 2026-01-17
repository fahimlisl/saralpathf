export const getToken = () => {
  return localStorage.getItem("accessToken")
}

export const getUserRole = () => {
  return localStorage.getItem("role")
}

export const isAuthenticated = () => {
  return !!getToken()
}
