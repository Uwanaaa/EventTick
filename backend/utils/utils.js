export const isAdmin = (user) => {
    if (user.role === "admin") {
        return true;
    }
    return false;
}

export const isSetPreference = (user) => {

    if (user.preferences && user.preferences?.gender && user.preferences?.religion && user.preferences?.distance && user.preferences?.profession && user.preferences?.ageRange?.min && user.preferences?.ageRange?.max) {
        return true;
    }
    return false;
}