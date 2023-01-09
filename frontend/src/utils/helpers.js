export const formatDateAndTime = (dateTime) => {
    const newDate = new Date(dateTime);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return `${daysOfWeek[newDate.getDay()]} ${newDate.toLocaleString('default', { month: 'long' })} ${newDate.getDate()} ${newDate.getFullYear()} at ${newDate.toLocaleTimeString()}`
}