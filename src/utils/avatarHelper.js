/**
 * Avatar Helper Utility
 * Returns appropriate avatar URL based on user gender
 */

export const getAvatarUrl = (gender) => {
  const avatars = {
    male: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    female: 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png'
  };
  
  // Default to male avatar if gender is not specified or invalid
  return avatars[gender?.toLowerCase()] || avatars.male;
};

export default getAvatarUrl;
