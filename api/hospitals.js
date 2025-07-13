const handler = async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if(req.method === "GET"){
        try{
            const latitude = 6.9067
            const longitude = 122.0673

            const radius = 5000;
            const query = `
                [out:json][timeout:25];
                (
                    node["amenity"="hospital"](around:${radius},${latitude},${longitude});
                    way["amenity"="hospital"](around:${radius},${latitude},${longitude});
                    relation["amenity"="hospital"](around:${radius},${latitude},${longitude});
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