const TOKEN = 'Authorization';
export const getToken = () => sessionStorage.getItem(TOKEN);
export const setToken = (token: string) => sessionStorage.setItem(TOKEN, token);
export const removeToken = () => sessionStorage.removeItem(TOKEN);
