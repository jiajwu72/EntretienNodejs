const nodemailer=require('nodemailer');
const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFDocument = require('pdfkit');
const fs = require("fs");
//var html_to_pdf = require('html-pdf-node');
var path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
//var conversion = require("phantom-html-to-pdf")();
const flattener = require('pdf-flatten');
//brew cask install pdftk
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
    if (req.file!=null)
      content.filePath = req.file.filename;
    console.log(content);


    // const data = {
    //   font: {
    //       "color" : "green",
    //       "include": "https://api.****.com/parser/v3/css/combined?face=Kruti%20Dev%20010,Calibri,DevLys%20010,Arial,Times%20New%20Roman"
    //   },
    //   testData: content
    // };
    // const gethtmltopdf = async () => {
    //     try {
    //         const filePathName = path.resolve(__dirname, '../views/SendPdf.ejs');
    //         const htmlString = fs.readFileSync(filePathName).toString();
    //         let  options = { format: 'Letter' };
    //         const ejsData = ejs.render(htmlString, data);
    //         return await pdf.create(ejsData, options).toFile('generatedfile.pdf',(err, response) => {
    //             if (err) return console.log(err);
    //             //console.log(response);
    //             const inputBuffer = fs.readFileSync(response.filename, err => { throw new Error(err) });
    //
    //             flattener.flatten(inputBuffer).then(res => {
    //               //console.log(res);
    //               fs.writeFileSync('outputFile.pdf', res, err => {
    //                 throw new Error(err)
    //                 console.log("err:",err);
    //                 console.log("flatten res:",res);
    //               });
    //               var smtpTrans = nodemailer.createTransport({
    //                  host: process.env.MAIL_HOST,
    //                  auth: {
    //                   user: process.env.MAILTRAP_USERNAME,
    //                   pass: process.env.MAILTRAP_PASSWORD
    //                  }
    //               });
    //               //console.log(smtpTrans);
    //
    //               var mailOptions = {
    //
    //                 to: content.email,
    //                 from: 'myemail@mailtrap.com',
    //                 subject: 'Test',
    //                 text: 'Envoi formulaire pdf aplatit',
    //                 attachments: [
    //                   {
    //                   filename: 'outputFile.pdf',
    //                   path: process.env.PWD+'/outputFile.pdf',
    //                   //cid: 'uniq-mailtrap.png'
    //                 }]
    //               };
    //
    //               try {
    //                 smtpTrans.sendMail(mailOptions, function(err,info) {
    //                   if(err) console.log("err:",err)
    //                   else{
    //                     console.log("here")
    //                   }
    //                 })
    //               } catch (e) {
    //                 console.log(e);
    //               }
    //             })
    //             return response;
    //         });
    //
    //
    //     } catch (err) {
    //         console.log("Error processing request: " + err);
    //     }
    //
    // }
    // gethtmltopdf();

    // const fillPdf = require("fill-pdf");
    // const formData = { "FieldName": 'Text to put into form field' };
    // const pdfTemplatePath = "templates.pdf";
    //
    // fillPdf.generatePdf(formData, pdfTemplatePath, function(err, output) {
    //   if ( !err ) {
    //     console.log("no error");
    //     res.type("application/pdf");
    //     res.send(output);
    //   }else {
    //     console.log(err);
    //   }
    // });
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream("output.pdf"));


    var initPosX=10;
    var initPosY=10;
    var fontsize=13;
    var espLittleX=60;
    var espBigX=110;
    var espLittleY=20;
    var CurrentX=initPosX;
    var CurrentY=initPosY;

    //Write First Line
    doc
    .fontSize(fontsize)
    .fillColor('#000000')
    .text('Nom:',initPosX,initPosY);
    CurrentX += espLittleX;
    doc
    .fontSize(fontsize)
    .fillColor('#000000')
    .text(content.lastname,CurrentX,CurrentY);

    CurrentX += espBigX;
    doc
    .fontSize(fontsize)
    .fillColor('#000000')
    .text('Prénom:',CurrentX,CurrentY);
    CurrentX += espLittleX;
    doc
    .fontSize(fontsize)
    .fillColor('#000000')
    .text(content.firstname,CurrentX,CurrentY);

    CurrentX = initPosX;
    CurrentY += espLittleY
    doc
    .fontSize(fontsize)
    .fillColor('#000000')
    .text('Information complémentaire:',CurrentX,CurrentY);
    CurrentX = initPosX;
    CurrentY += espLittleY
    doc
    .fontSize(fontsize)
    .fillColor('#000000')
    .text(content.infos,CurrentX,CurrentY);

    CurrentY += espLittleY;
    CurrentX = initPosX;
    doc
    .fontSize(fontsize)
    .fillColor('#000000')
    .text('Domaines:',CurrentX,CurrentY);

    CurrentX = CurrentX;
    CurrentY += espLittleY;
    var domains = content.domain;
    if (domains!=null){
      var t = typeof domains;
      var t1=typeof " ";
      var t2=typeof [" "];
      if (t==t1){
        doc
        .fontSize(fontsize)
        .fillColor('#000000')
        .text(domains,CurrentX,CurrentY);
        CurrentY += espLittleY;
      }else {
        for (var i = 0; i < domains.length; i++) {
          doc
          .fontSize(fontsize)
          .fillColor('#000000')
          .text(domains[i],CurrentX,CurrentY);
          CurrentY += espLittleY;
        }
      }
      //console.log(typeof domains);

    }

    // doc
    // .fontSize(fontsize)
    // .fillColor('#000000')
    // .text('Nom:',10,10);


    if (req.file!=null){
      CurrentX = initPosX;
      CurrentY += espLittleY
      doc
      .fontSize(fontsize)
      .fillColor('#000000')
      .text('Signature:',CurrentX,CurrentY);
      CurrentY += espLittleY;
      CurrentX = initPosX;
      doc
      .image(process.env.PWD + "/uploads/" +content.filePath,CurrentX,CurrentY,{width:100});
    }
    console.log(content.filePath);



    doc.end();

    res.status(200).send('Un PDF a été envoyé, Veuillez vérifier votre boite email');
  }

}
module.exports=new SendController()
