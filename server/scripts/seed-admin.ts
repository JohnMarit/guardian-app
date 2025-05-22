const baseURL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname !== 'localhost'
    ? 'https://community-guard-2525c539a22c.herokuapp.com/api'
    : 'http://localhost:3001/api'); 