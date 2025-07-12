const handler = async(req, res) => {
    if(req.method === "POST"){
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
            res.status(err.status).json({msg: err.message});
        }
    }
    else{
        res.status(405).json({msg: "Method Not Allowed!"});
    }
}

export default handler;