const fetchLocation = async(req, res, next) => {
    try{
        const ress = await fetch(process.env.LOCATION_SOURCE);
        if(!ress.ok){
            throw new Error("No Location Fetch!"); 
        }
        const data = await ress.json();
        const locationData = {
            city: data.city,
            region: data.region,
            country: data.country,
            latitude: data.latitude,
            longitude: data.longitude
        }
        res.status(200).json(locationData);
    }
    catch(err){
        const error = err.message;
        error.status = 404;
        next(error);
    }
}

const fetchHospital = async(req, res, next) => {
    try{
        const latitude = Number(req.body.latitude);
        const longitude = Number(req.body.longitude);

        const location = {
            latitude: latitude,
            longitude: longitude
        }

        const radius = 5000;
        const query = `
            [out:json][timeout:25];
            (
                node["amenity"="hospital"](around:${radius},${location.latitude},${location.longitude});
                way["amenity"="hospital"](around:${radius},${location.latitude},${location.longitude});
                relation["amenity"="hospital"](around:${radius},${location.latitude},${location.longitude});
            );
            out center tags;
            `;
        const ress = await fetch(process.env.HOSPITAL_SOURCE, {
            method: "POST",
            body: "data=" + encodeURIComponent(query),
        });
        if(!ress.ok){
            throw new Error("No Hospital Fetch!");
        }
        const data = await ress.json();
        const hospitalData = data.elements;
        res.status(200).json(hospitalData);
    }
    catch(err){
        const error = err.message;
        error.status = 404;
        next(error);
    }
}

export {fetchLocation, fetchHospital};