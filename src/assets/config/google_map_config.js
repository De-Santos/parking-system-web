const gapi_key = import.meta.env.VITE_GOOGLE_MAP_API_KEY
import { Loader } from '@googlemaps/js-api-loader'


const map_loader = new Loader({
  apiKey: gapi_key,
  version: 'weekly'
})

export { map_loader };
