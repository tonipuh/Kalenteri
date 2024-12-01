declare module 'all-the-cities' {
    interface CityData {
        name: string;
        country: string;
        lat: number;
        lon: number;
        population: number;
    }

    const cities: CityData[];
    export default cities;
}