import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


app.post("/chat",async(req,res)=>{
    const { message } = req.body;
    console.log("User Said", message);

    // res.json({
    //     reply: "This is a free demo reply. Backend is working.."
    // });


    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${process.env.OPENAI_KEY}`

            },
            body:JSON.stringify({
                model:"gpt-4.1-mini",
                message:[{role:"user",content:message}],
            }),
        });

            const data = await response.json();
            console.log("OpenAi Respones:",data);

            if(!data.choices){
                return res.json({
                    reply:"OpenAi error:" + (data.error.message  || "Somethins went wrong")
                });
            }

            const replyText = data.choices[0].message.content;
            res.json({reply:replyText});


    } catch (error) {
        console.log("Server Error:", error);
        res.json({reply: "Something went wrong!" });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});