import { z } from "zod";
import { AxiosStatic } from "axios";

const LocationInfoSchema = z.object({
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
});

export type LocationInfo = z.infer<typeof LocationInfoSchema>;

export async function fetchLocationData (
    axios: AxiosStatic,
    apiURL: string,
    locationName: string,
    apiKey: string
): Promise<LocationInfo> {
    const options = {
        method: "GET",
        url: apiURL,
        params: {
            q: locationName,
            api_key: apiKey
        }
    };
    
    const response = await axios.request<LocationInfo[]>(options);
    if(response.status === 200) {
        try{
            return LocationInfoSchema.parse(response.data[0]);
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to find location information for ${locationName}`);
        }
    } else {
        throw new Error(`Failed to fetch location data.`);
    }
}