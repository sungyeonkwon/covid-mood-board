import {Mood} from 'src/constants/constants';

// Todo: cache this, rather than calculating all the time.
export const getPercentage = (users, mood: Mood) => {
  const total = users.length;
  const numerator = users.filter(user => user.mood === mood).length;
  return (numerator / total * 100).toFixed(1) + '%';
}
