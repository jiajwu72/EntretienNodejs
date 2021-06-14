const { PDFDocument,rgb } = require('pdf-lib');
const nodemailer=require('nodemailer');
const fs = require('fs');
const sendIt=(email,hasFile)=>{
  var smtpTrans = nodemailer.createTransport({
                   host: process.env.MAIL_HOST,
                   auth: {
                    user: process.env.MAILTRAP_USERNAME,
                    pass: process.env.MAILTRAP_PASSWORD
                   }
                });
                var mailOptions = {

                  to: email,
                  from: 'myemail@mailtrap.com',
                  subject: 'Test',
                  text: 'Envoi formulaire pdf aplatit',
                  attachments: []
                };
                if (hasFile){
                  const attach ={
                    filename: 'test.pdf',
                    path: process.env.PWD+'/test.pdf',
                  };
                  mailOptions.attachments[0] = attach;
                }

                try {
                  smtpTrans.sendMail(mailOptions, function(err,info) {
                    if(err) console.log("err:",err)
                    else{
                      console.log(info,"sendsuccess")
                    }
                  })
                } catch (e) {
                  console.log(e);
                }
}
class SendController {
  constructor(){

  }



  async SendMail(req,res){
    const content = req.body;
    if (content.email ==""){
      res.status(500).send('Email ne doit pas être vide!');
    }

    if (req.file!=null)
      content.filePath = req.file.filename;
    //console.log(content);
    const directoryPath=process.env.PWD + "/uploads";

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const form = pdfDoc.getForm();
    const { width, height } = page.getSize();
    var initPosX=10;
    var initPosY=height - 4*10;
    var fontsize=16;
    var fontsizeLittle=12;
    var espLittleX=60;
    var espBigX=210;
    var espLittleY=75;
    var CurrentX=initPosX;
    var CurrentY=initPosY;

    page.drawText('Nom:', { x: initPosX, y: initPosY, size: fontsize })
    const lastnameFiled = form.createTextField('info.lastname')
    lastnameFiled.setText(content.lastname,{size: fontsize});
    CurrentX += espLittleX;
    lastnameFiled.addToPage(page, { x: CurrentX, y: CurrentY-15})

    CurrentX += espBigX;
    page.drawText('Prénom:', { x: CurrentX, y: CurrentY, size: fontsize })
    const firstnameFiled = form.createTextField('info.firstname')
    firstnameFiled.setText(content.firstname,{size: fontsize});
    CurrentX += espLittleX;
    firstnameFiled.addToPage(page, { x: CurrentX, y: CurrentY-15})

    CurrentX = initPosX;
    var domains = content.domain;
    const backField = form.createCheckBox('domain.devBack')
    const frontField = form.createCheckBox('domain.devFront')
    const opsField = form.createCheckBox('domain.devOps')


    CurrentY -=espLittleY;
    backField.addToPage(page, { x: CurrentX, y: CurrentY })
    CurrentX += espLittleX;
    page.drawText('Développeur back', { x: CurrentX, y: CurrentY, size: fontsize })

    CurrentX=initPosX;
    CurrentY -=espLittleY;
    frontField.addToPage(page, { x: CurrentX, y: CurrentY })
    CurrentX += espLittleX;
    page.drawText('Développeur front', { x: CurrentX, y: CurrentY, size: fontsize })

    CurrentX=initPosX;
    CurrentY -=espLittleY;
    opsField.addToPage(page, { x: CurrentX, y: CurrentY })
    CurrentX += espLittleX;
    page.drawText('DevOps', { x: CurrentX, y: CurrentY, size: fontsize })

    if (domains!=null){
      var t = typeof domains;
      var t1=typeof " ";
      var t2=typeof [" "];
      if (t==t1){
        if (domains=="DevBack"){
          backField.check();
        }
        if (domains=="DevFront"){
          frontField.check();
        }
        if (domains=="DevOps"){
          opsField.check();
        }
      }else {
        for (var i = 0; i < domains.length; i++) {
          if (domains[i]=="DevBack"){
            backField.check();
          }
          if (domains[i]=="DevFront"){
            frontField.check();
          }
          if (domains[i]=="DevOps"){
            opsField.check();
          }
        }
      }
    }
    form.flatten();
    CurrentX=initPosX;
    CurrentY -=35;
    page.drawText('Informations Complémentaire:', { x: CurrentX, y: CurrentY, size: fontsize })

    CurrentX=initPosX;
    CurrentY -=20;
    page.drawText(content.infos, { x: CurrentX, y: CurrentY, size: fontsizeLittle })

    CurrentX=initPosX;
    CurrentY -=20;
    page.drawText(content.infos, { x: CurrentX, y: CurrentY, size: fontsizeLittle })

    CurrentY -= espLittleY;
    //console.log("content.filePath:",content.filePath);
    var hasFile = content.filePath != null;
    if (hasFile){
      //console.log("hasFile0");
      const st = content.filePath.split('.');
      const ext = st[st.length-1];
      var filePath = process.env.PWD + "/uploads/" +content.filePath;
      await fs.readFile(filePath,async function(err,data){
        if (err){
          console.log(err);
        }else {
          if (ext.toLowerCase()=="jpg"){
            const img = await pdfDoc.embedJpg(data);
            const dim = img.scale(1);
            const propotion = dim.width/120;
            const w = dim.width/propotion;
            const h = dim.height/propotion;
            page.drawImage(img, {
              x: CurrentX,
              y: CurrentY,
              width: w,
              height: h,
            })

          }
          else if (ext.toLowerCase()=="png"){
            const img = await pdfDoc.embedPng(data);
            const dim = img.scale(1);
            const propotion = dim.width/120;
            const w = dim.width/propotion;
            const h = dim.height/propotion;
            page.drawImage(img, {
              x: CurrentX,
              y: CurrentY,
              width: w,
              height: h,
            })
          }
          const pdfBytes = await pdfDoc.save();
          fs.writeFile('test.pdf', pdfBytes,err=>{
            if (err){
              console.log(err);
            }else{
              console.log("success");

              sendIt(content.email,hasFile);
            }
          });
        }

      });
      res.status(200).send('Un PDF a été envoyé, Veuillez vérifier votre boite email');

    }
    else {
      //console.log("!hasFile");
      sendIt(content.email,hasFile);
      res.status(200).send('Un PDF a été envoyé, Veuillez vérifier votre boite email');
    }


  }

}
module.exports=new SendController()
