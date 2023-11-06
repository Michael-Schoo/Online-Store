# Listing Website

Env vars you will need inside `.env`

* `NEXTAUTH_URL`: where the app is run, ie "<http://localhost:3000>"
* `NEXTAUTH_SECRET`: a random string
* `GOOGLE_CLIENT_ID`: the google client id (for oauth)
* `GOOGLE_CLIENT_SECRET`: the google client secret (for oauth)
* `DATABASE_URL`: the MySQL database (i used [PlanetScale](https://planetscale.com/))
* `SMTP_FROM`: the email address to send emails from
* `EMAIL_API_URL`: the email api url (i used a proxy of [MailChannels](https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/) through CloudFlare workers)
* `UPLOADTHING_SECRET`: the secret for [uploadthing](https://uploadthing.com/) (it has custom API, so kind of required)
* `UPLOADTHING_APP_ID`: similar as above

## Running

1. `npm install`
2. `npm run build`
3. `npm run start`
