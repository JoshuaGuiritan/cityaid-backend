const handler = async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if(req.method === "POST"){
        try{
            const latitude = parseFloat(req.body.latitude);
            const longitude = parseFloat(req.body.longitude);

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
            res.status(500).json({msg: err.message});
        }
    }
    else{
        res.status(405).json({msg: "Method Not Allowed!"});
    }
}

export default handler;