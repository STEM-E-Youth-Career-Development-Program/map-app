import { MAP_API_KEY } from '@env';

export function decodePolyline(polyline) {
    var polylineChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var polylinePoints = [];
    var index = 0, lat = 0, lng = 0;

    while (index < polyline.length) {
        var b, shift = 0, result = 0;

        do {
            b = polyline.charCodeAt(index++) - 63; // Decode the character from the polyline
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            b = polyline.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        var point = { latitude: lat / 1e5, longitude: lng / 1e5 };
        polylinePoints.push(point);
    }

    return polylinePoints;
}

export const calculateDistanceAndDuration = async (origin, destination, mode) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=${mode}&key=${MAP_API_KEY}`
        );

        const data = await response.json();

        // Check if the response contains valid data
        if (data && data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0]) {
            // Extract duration in seconds from the API response
            const durationInMins = data.rows[0].elements[0]?.duration?.text;

            return durationInMins || 'N/A';
        } else {
            // Handle invalid or empty response
            console.error('Invalid API response');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};
