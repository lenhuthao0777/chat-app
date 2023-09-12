import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? undefined
    : process.env.NEXT_PUBLIC_SITE_URL;

const socketIO = io(URL as string, {
  path: '/api/socket/io',
});

export default socketIO;
