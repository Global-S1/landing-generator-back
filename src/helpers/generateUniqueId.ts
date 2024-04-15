export const generateUniqueId = (text = '') => {
    return text + Math.random().toString(30).substring(2);
}