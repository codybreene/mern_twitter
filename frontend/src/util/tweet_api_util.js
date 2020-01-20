import axios from 'axios';

export const getTweets = () => (
  axios.get('/api/tweets')
);

export const getUserTweets = (id) => (
  axios.get(`/api/tweets/user/${id}`)
);

export const writeTweet = (tweet) => (
  axios.post('/api/tweets/', tweet)
);
