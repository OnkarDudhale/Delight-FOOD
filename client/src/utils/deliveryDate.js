export const getDeliveryDate = (createdAt, days = 7) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + days);
    return date;
};