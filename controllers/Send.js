
const nodemailer=require('nodemailer');
//const { PDFNet } = require('@pdftron/pdfnet-node');
//const PDFDocument = require('pdfkit');
const fs = require("fs");
//var html_to_pdf = require('html-pdf-node');
var path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
//var conversion = require("phantom-html-to-pdf")();
const flattener = require('pdf-flatten');
//const location=window.location;

class SendController {
  //var Pdf;

  constructor(){
    //Pdf=null;
  }
  // const SendIt(filepath)=>{
  //
  // }

  async SendMail(req,res){
    const content = req.body;
    if (content.email ==""){
      res.status(500).send('Email ne doit pas être vide!');
    }

    let options = { format: 'A4' };
    //brew install imagemagick && brew install graphicsmagick

    //content.host = full;
    if (req.file!=null)
      content.filePath = req.file.filename;
    console.log(content);
    console.log(content.filePath);
    //console.log("content.domain.some('DevBack')",content.domain.indexOf("DevBack")>-1);
    const data = {
      font: {
          "color" : "green",
          "include": "https://api.****.com/parser/v3/css/combined?face=Kruti%20Dev%20010,Calibri,DevLys%20010,Arial,Times%20New%20Roman"
      },
      testData: content
    };
    const gethtmltopdf = async () => {
        try {
            const filePathName = path.resolve(__dirname, '../views/SendPdf.ejs');
            const htmlString = fs.readFileSync(filePathName).toString();
            let  options = { format: 'Letter' };
            const ejsData = ejs.render(htmlString, data);
            return await pdf.create(ejsData, options).toFile('generatedfile.pdf',(err, response) => {
                if (err) return console.log(err);
                console.log(response);
                const inputBuffer = fs.readFileSync(response.filename, err => { throw new Error(err) });

                 // the flatten() method takes a buffer as an input
                flattener.flatten(inputBuffer).then(res => {
                  console.log(res) // output is the flattened pdf via a buffer as well
                  fs.writeFileSync('outputFile.pdf', res, err => {
                    throw new Error(err)
                    console.log("err:",err);
                    console.log("flatten res:",res);
                  });
                  var smtpTrans = nodemailer.createTransport({
                     host: process.env.MAIL_HOST,
                     auth: {
                      user: process.env.MAILTRAP_USERNAME,
                      pass: process.env.MAILTRAP_PASSWORD
                     }
                  });
                  //console.log(smtpTrans);

                  var mailOptions = {

                    to: content.email,
                    from: 'myemail@mailtrap.com',
                    subject: 'Test',
                    text: 'Envoi formulaire pdf aplatit',
                    attachments: [
                      {
                      filename: 'outputFile.pdf',
                      path: process.env.PWD+'/outputFile.pdf',
                      //cid: 'uniq-mailtrap.png'
                    }]
                  };

                  try {
                    smtpTrans.sendMail(mailOptions, function(err,info) {
                      if(err) console.log("err:",err)
                      else{
                        console.log("here")
                      }
                    })
                  } catch (e) {
                    console.log(e);
                  }
                })
                return response;
            });


        } catch (err) {
            console.log("Error processing request: " + err);
        }

    }
    gethtmltopdf();


    //res.redirect('back');
    res.status(200).send('Un PDF a été envoyé, Veuillez vérifier votre boite email');
  }

}
module.exports=new SendController()
