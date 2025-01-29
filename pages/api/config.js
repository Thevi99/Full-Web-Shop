import configsettingModel from '../../src/models/configsettingModel';
import dbConnect from "../../src/lib/mongo";
const handler = async (req, res) => {
    await dbConnect();
    if(req.method === 'GET'){
        try {
            const configsetting = await configsettingModel.find();
            const data = configsetting[0].title;
            return res.status(200).json({
                title: configsetting[0].title,
                description: configsetting[0].description,
                logo: configsetting[0].logo,
                video: configsetting[0].video,
                faqyt: configsetting[0].faqyt,
                bank: configsetting[0].bank,
            });
        } catch (error) {
            console.error("Error fetching config settings:", error);
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
}

export default handler;