export default handler = async(req, res) => {
    if(req.method === "GET"){
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
            res.status(err.status).json({msg: err.message});
        }
    }
    else{
        res.status(405).json({msg: "Method Not Allowed!"});
    }
}