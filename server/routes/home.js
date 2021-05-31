var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs= require('fs');


//storage
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});

//upload
let upload = multer({ storage: storage }).array('file');

router.post("/sendemail", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        let to = req.body.to;
        let subject = req.body.subject;
        let body = req.body.body;
        let fileNameToAttach = req.files[0].path; //capture the path of the uploading image
        let newemail = { to, subject, body  };

        console.log("to:", to);
        console.log("subject:", subject);
        console.log("body:", body);
        console.log("path:", fileNameToAttach);
    

        let transporter = nodemailer.createTransport({
           service:'gmail',
           auth:{
               user:'cheapos123tpf@gmail.com',
               pass:'123tpf123'
            // user:process.env.EMAIL,
            // pass:process.env.WORD
           }
        })

        let mailOptions = {
            from: 'cheapos123tpf@gmail.com',
            to: to,
            subject: subject,
            text: body,
            attachments: [{path:fileNameToAttach}]
        }

        transporter.sendMail(mailOptions, (err, data)=>{
            if(err){
                console.log("Error:", err)
            }else{
                console.log("Email sent successfully")

                fs.unlink(fileNameToAttach, (err)=>{
                    if(err){
                        return res.end(err)
                    }else{
                        console.log("deleted upload")
                        return res.json({ status: "Email sent", email: newemail });
                    }
                })
            }
       })
    });
});






module.exports = router;