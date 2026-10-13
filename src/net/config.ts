// Where online games are hosted (Supabase project "Blackthorne-Management's Project", schema `bloodlines`, function
// `bloodlines`). The anon key is public by design: it only lets the app call the game server, which checks every request.
export const SERVER = {
  url: 'https://mawdkpwegsjmdqoagevi.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2RrcHdlZ3NqbWRxb2FnZXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTM2ODIsImV4cCI6MjEwNTY2OTY4Mn0.w0pC3tiXf4ipgN14mavwiKvBsVO4CmS1EyF77MeC2y4',
  // A local test server (scripts/dev-server.mjs) can stand in: open the app with ?server=http://localhost:8787
  override: typeof location !== 'undefined' ? new URLSearchParams(location.search).get('server') : null,
};
